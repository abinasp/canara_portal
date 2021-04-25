import React from 'react';

import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  Paper,
  TableHead,
  TableRow,
  TextField,
  Button,
  InputAdornment,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import toastr from 'toastr';

import { connect } from 'react-redux';
import ReactSelect from 'react-select';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';

import TranslatorDashboardStyle from '../styles';
import authReducer from '../../../redux/modules/auth';
import translationReducer from '../../../redux/modules/translation';
import TablePaginationsAction from '../components/Table/Table';
import config from '../../../config';


class TranslatorDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unModeratedStrings: [],
      page: 0,
      rowsPerPage: 10,
      search: '',
      selectedLanguage: [],
      isLanguageChecked: false,
      languageLists: [],
      menuOpenLang: false,
      rowSelected: [],
      stringType: {},
      stringTypeLists: [],
      menuOpenString: false,
      strings: [],
      open: false,
      editedIndex: ''
    }
    this.initSwalekh = this.initSwalekh.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSelectAll = this.handleSelectAll.bind(this);
    this.onSaveModeratedString = this.onSaveModeratedString.bind(this);
    this.onSearchStrings = this.onSearchStrings.bind(this);
    this.onSaveMultipleString = this.onSaveMultipleString.bind(this);
  }

  componentDidMount() {
    let newOptions = [];
    const { user } = this.props;
    if (user && user.languages && user.languages.length > 0) {
      user.languages.forEach(lang => {
        if (lang !== 'english') {
          newOptions.push({
            label: lang[0].toUpperCase() + lang.slice(1),
            value: lang
          });
        }
      });
    }
    let newOptions1 = config.stringType.map(s => ({ label: s[0].toUpperCase() + s.slice(1), value: s }))
    this.setState({
      languageLists: newOptions,
      selectedLanguage: newOptions.length > 0 ? newOptions[0] : [],
      stringTypeLists: newOptions1,
      stringType: newOptions1[0]
    }, () => {
      this.getStrings();
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.props = nextProps
    }
  }

  getStrings() {
    const { selectedLanguage, page, rowsPerPage, stringType, search } = this.state;
    const { translationReducer } = this.props;
    translationReducer.getStrings({
      language: selectedLanguage.value,
      page: page + 1,
      rowsPerPage: rowsPerPage,
      search,
      status: stringType.value
    }).then(res=>{
      const { strings } = this.props;
      this.setState({ strings });
    });
  }

  handleChangePage(e, page) {
    // console.log(page)
    // if(!page) return;
    this.setState({ page }, () => {
      this.getStrings();
    });
  }

  handleChangeRowsPerPage(e) {
    if (e && e.target) {
      const { value } = e.target;
      this.setState({ rowsPerPage: value }, () => {
        this.getStrings();
      });
    }
  }

  handleSearchChange(e) {
    const { search } = this.state;
    if(e.target && e.target.value && e.target.value.length > 0){
      this.setState({ search: e.target.value });
    }else{
      this.setState({ search: '' }, ()=>{
        this.getStrings();
      })
    }
  }

  onSearchStrings(e){
    if(e.charCode === 13){
      this.setState({ page: 0 }, ()=>{
        this.getStrings();
      })
    }
  }

  handleSelectAll(e) {
    const { strings } = this.props;
    if (e.target.checked) {
      const newSelected = strings.map(r => r.row_id);
      this.setState({ rowSelected: newSelected });
    } else {
      this.setState({ rowSelected: [] });
    }
  }

  handleSelectRow = (e, row_id) => {
    let { rowSelected } = this.state;
    let newSelected = [];
    let selectedIndex = rowSelected.indexOf(row_id);
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(rowSelected, row_id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(rowSelected.slice(1))
    } else if (selectedIndex === rowSelected.length - 1) {
      newSelected = newSelected.concat(rowSelected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        rowSelected.slice(0, selectedIndex),
        rowSelected.slice(selectedIndex + 1)
      );
    }
    this.setState({ rowSelected: newSelected });
  }

  handleChangeTarget(e, index) {
    const newState = Object.assign({}, this.state);
    newState.strings[index].target = e.target ? e.target.value : newState.strings[index].target;
    this.setState({ strings: newState.strings });
    // const { translationReducer } = this.props;
    // translationReducer.handleChangeTarget({ index, value: e.target && e.target.value });
  }

  onTargetSave(i) {
    const {strings} = this.state;
    const editedString = strings[i];
    if(editedString.status === "moderated"){
      this.setState({ open: true, editedIndex: i });
    }else{
      const { translationReducer } = this.props;
      translationReducer.handleStringSave([editedString]).then(res=>{
        this.getStrings();
        if(res.status === 1){
          toastr.success('Transalation has been saved');
        }
      })
    }
  }

  onSaveModeratedString(){
    const {strings, editedIndex} = this.state;
    const editedString = strings[editedIndex];
    const { translationReducer } = this.props;
    translationReducer.handleStringSave([editedString]).then(res=>{
      this.getStrings();
      this.setState({ open: false })
      if(res && res.status === 1){
        toastr.success('Transalation has been saved');
      }else{
        toastr.warning("Error in saving string");
      }
    })
  }

  onSaveMultipleString(){
    const { rowSelected, strings } = this.state;
    if(!rowSelected || rowSelected.length===0){
      return toastr.warning('Select at least one row');
    }
    let newEditedStrings = strings.filter(s=>rowSelected.indexOf(s.row_id) !== -1)
    const { translationReducer } = this.props;
    translationReducer.handleStringSave(newEditedStrings).then(res=>{
      this.getStrings();
      if(res && res.status === 1){
        toastr.success('Transalation has been saved');
        this.setState({ rowSelected: [] });
      }
    })
  }

  initSwalekh(i) {
    /*global $*/ // To disable any eslint '$ is not defined' errors
    const { strings } = this.state;
    if ($(`#target_${i}`).attr('data-indic-input-mode')) {
      console.log('Swalekh already initialized');
      return;
    }
    $(`#target_${i}`).indicInputEditor({
      apikey: 'afee449fdccfa8d5890d5076eb456a79',
      appid: 'com.prabandhak',
      orgName: 'Prabandhak',
      numSuggestions: 7,
      mode: 'phonetic',
      domain: 1,
      theme: 'light'
    });
    $(`#target_${i}`).trigger('change_lang', strings[i].targetLanguage);
  }

  render() {
    const { classes, theme, user, total } = this.props;
    const { page, rowsPerPage, search, rowSelected, strings, open } = this.state;
    return (
      <>
        <Grid item xs={12}>
          <Paper className={classes.paper} classes={{ root: classes.widgetRoot }}>
            <Grid container xs={12} style={{ padding: '24px' }}>
              <Grid item xs={12} md={2} lg={2}>
                {user && user.languages && user.languages.length > 0 && (
                  <div style={{ marginRight: '10px' }}>
                    <ReactSelect
                      options={this.state.languageLists}
                      menuIsOpen={this.state.menuOpenLang}
                      onFocus={() => this.setState({ menuOpenLang: true })}
                      onBlur={() => this.setState({ menuOpenLang: false })}
                      value={this.state.selectedLanguage}
                      tabSelectsValue={false}
                      placeholder="Select Target Language"
                      onChange={e => {
                        if (!e) {
                          this.setState({ selectedLanguage: {} }, () => {
                            this.getStrings();
                          })
                        } else {
                          this.setState({ selectedLanguage: e }, () => {
                            this.getStrings()
                          })
                        }
                      }}
                    />
                  </div>
                )}
              </Grid>
              <Grid item xs={12} md={2} lg={2}>
                <ReactSelect
                  options={this.state.stringTypeLists}
                  menuIsOpen={this.state.menuOpenString}
                  onFocus={() => this.setState({ menuOpenString: true })}
                  onBlur={() => this.setState({ menuOpenString: false })}
                  value={this.state.stringType}
                  tabSelectsValue={false}
                  placeholder="Select string type"
                  onChange={e => {
                    if (!e) {
                      this.setState({ stringType: {} }, () => {
                        this.getStrings();
                      });
                    } else {
                      this.setState({ stringType: e }, () => {
                        this.getStrings();
                      });
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2} lg={2} />
              <Grid item xs={6}>
                <TextField
                  className={classes.margin}
                  value={search}
                  style={{ width: '50%', float: 'right' }}
                  placeholder="Search Source..."
                  onChange={this.handleSearchChange}
                  onKeyPress={this.onSearchStrings}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="primary" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>
            {rowSelected && rowSelected.length > 0 && (
              <div style={{ padding: '16px', backgroundColor: 'aliceblue' }}>
                <p style={{ float: 'left', margin: '8px', fontWeight: 'bold', color: '#1956ad' }}>{rowSelected.length} Selected</p>
                <Button style={{ float: 'right' }} variant="contained" color="primary" onClick={this.onSaveMultipleString}>Save Selected</Button>
              </div>
            )}
            <Table style={{ marginTop: '-10px' }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" align="center">
                    <Checkbox
                      style={{ color: '#6E6E6E' }}
                      indeterminate={rowSelected.length > 0 && rowSelected.length < strings.length}
                      checked={rowSelected.length > 0 && rowSelected.length === strings.length}
                      onChange={this.handleSelectAll}
                    />
                  </TableCell>
                  <TableCell padding="default" style={{ color: '#1956ad' }}>Source String</TableCell>
                  <TableCell padding="default" style={{ color: '#1956ad' }}>Target String</TableCell>
                  <TableCell padding="default" style={{ color: '#1956ad' }}>Target Language</TableCell>
                  <TableCell padding="default" style={{ color: '#1956ad' }}>String Type</TableCell>
                  <TableCell padding="default" style={{ color: '#1956ad' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {strings && strings.map((s, i) => (
                  <TableRow key={i}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={rowSelected.indexOf(s.row_id) !== -1}
                        style={{ color: '#1956ad' }}
                        onChange={(e) => this.handleSelectRow(e, s.row_id)}
                      />
                    </TableCell>
                    <TableCell padding="default" style={{ width: "400px"}}>{s.source}</TableCell>
                    <TableCell padding="default" style={{ width: "400px"}}>
                      <TextField
                        id={`target_${i}`}
                        value={s.target}
                        style={{ width: '100%' }}
                        onChange={(e) => this.handleChangeTarget(e, i)}
                        onBlur={(e)=>this.handleChangeTarget(e, i)}
                        onFocus={() => this.initSwalekh(i)}
                        multiline
                      />
                    </TableCell>
                    <TableCell padding="default">{s.targetLanguage}</TableCell>
                    <TableCell padding="default">{s.status}</TableCell>
                    <TableCell padding="default">
                      <Button color="primary" variant="contained" onClick={() => this.onTargetSave(i)} >Save</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    count={total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationsAction}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </Paper>
        </Grid>
        <Dialog open={open} onClose={()=>this.setState({open : false})} aria-labelledby="form-dialog-title" fullWidth maxWidth="sm">
          <DialogTitle id="form-dialog-title">Save String</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure to save this moderated string ?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>this.setState({open: false})} classes={{ root: classes.button }} variant="contained" size="large" color="secondary">
              No
            </Button>
            <Button onClick={this.onSaveModeratedString} classes={{ root: classes.button }} variant="contained" size="large" color="primary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}

const TranslatorDashboardConatiner = connect(
  state => ({
    error: state.get('auth').error,
    loading: state.get('auth').loading,
    user: state.get('auth').user,
    strings: state.get('translation').strings,
    total: state.get('translation').total
  }),
  dispatch => ({
    authReducer: authReducer.getActions(dispatch),
    translationReducer: translationReducer.getActions(dispatch)
  })
)(TranslatorDashboard);

export default withStyles(TranslatorDashboardStyle, { withTheme: true })(TranslatorDashboardConatiner);