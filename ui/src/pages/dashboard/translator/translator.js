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
  InputAdornment
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import { connect } from 'react-redux';
import ReactSelect from 'react-select';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';

import TranslatorDashboardStyle from '../styles';
import authReducer from '../../../redux/modules/auth';
import TablePaginationsAction from '../components/Table/Table';

const dummy = [
  {
    source: "Breakfast", 
    target: "Breakfast", 
    targetLanguage: "hindi", 
    sourceLanguage: "english",
    apikey: 'canara_bank_apikey'
  },
  {
    source: "Lunch", 
    target: "lunch", 
    targetLanguage: "hindi", 
    sourceLanguage: "english",
    apikey: 'canara_bank_apikey'
  },
  {
    source: "Dinner", 
    target: "dinner", 
    targetLanguage: "hindi", 
    sourceLanguage: "english",
    apikey: 'canara_bank_apikey'
  },
  {
    source: "Monday", 
    target: "Monday", 
    targetLanguage: "hindi", 
    sourceLanguage: "english",
    apikey: 'canara_bank_apikey'
  },
  {
    source: "Apple", 
    target: "apple", 
    targetLanguage: "hindi", 
    sourceLanguage: "english",
    apikey: 'canara_bank_apikey'
  },
  {
    source: "Monday", 
    target: "Monday", 
    targetLanguage: "telugu", 
    sourceLanguage: "english",
    apikey: 'canara_bank_apikey'
  },
  {
    source: "Apple", 
    target: "apple", 
    targetLanguage: "telugu", 
    sourceLanguage: "english",
    apikey: 'canara_bank_apikey'
  },
  {
    source: "Monday", 
    target: "Monday", 
    targetLanguage: "telugu", 
    sourceLanguage: "english",
    apikey: 'canara_bank_apikey'
  },
  {
    source: "Apple", 
    target: "apple", 
    targetLanguage: "telugu", 
    sourceLanguage: "english",
    apikey: 'canara_bank_apikey'
  },
];

class TranslatorDashboard  extends React.Component{
  constructor(props){
    super(props);
    this.state={
      unModeratedStrings: [],
      page: 0,
      rowsPerPage: 5,
      search:'',
      selectedLanguage: [],
      isLanguageChecked: false,
      languageLists: [],
      menuOpenLang: false,
    }
    this.initSwalekh = this.initSwalekh.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount(){
    let newOptions = [];
    const { user } =this.props;
    if(user && user.languages && user.languages.length > 0){
      user.languages.forEach(lang=>{
        if (lang !== 'english') {
          newOptions.push({
            label: lang[0].toUpperCase() + lang.slice(1),
            value: lang
          });
        }
      });
    }
    this.setState({ unModeratedStrings: dummy, languageLists: newOptions, selectedLanguage: newOptions });
  }

  componentWillReceiveProps(nextProps){
    if(this.props !== nextProps){
      this.props = nextProps
    }
  }

  handleChangePage(e,page){
    if(!page) return;
    this.setState({ page });
  }

  handleChangeRowsPerPage(e){
    if(e && e.target){
      const { value } = e.target;
      this.setState({ rowsPerPage: value });
    }
  }

  handleSearchChange(e){
    this.setState({search: e.target.value})
  }

  handleChangeTarget(e,i){
    const newState = Object.assign({}, this.state);
    newState.unModeratedStrings[i].target = e.target.value;
    this.setState({ state: newState });
  }

  onTargetSave(i){
    const { unModeratedStrings } = this.state;
    console.log(unModeratedStrings[i]);
  }

  initSwalekh(i){
    /*global $*/ // To disable any eslint '$ is not defined' errors
    if($(`#target_${i}`).attr('data-indic-input-mode')){
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
    $(`#target_${i}`).trigger('change_lang', this.state.unModeratedStrings[i].targetLanguage);
  }

  render(){
    const { classes, theme, user } = this.props;
    const { unModeratedStrings, page, rowsPerPage, search } =this.state;
    return(
      <>
        <Grid item xs={12}>
          <Paper className={classes.paper} classes={{root: classes.widgetRoot}}>
            <Grid container xs={12} style={{ padding: '24px' }}>
              <Grid item xs={6}>
                {user && user.languages && user.languages.length>0 && (
                  <div style={{ width: '50%' }}>
                    <ReactSelect
                      isMulti
                      options={this.state.languageLists}
                      menuIsOpen={this.state.menuOpenLang}
                      onFocus={() => this.setState({ menuOpenLang: true })}
                      onBlur={() => this.setState({ menuOpenLang: false })}
                      value={this.state.selectedLanguage}
                      tabSelectsValue={false}
                      onChange={e=>{
                        if(!e){
                          this.setState({ selectedLanguage: [] }, ()=>{
                            if(!this.state.selectedLanguage || this.state.selectedLanguage.length === 0 || this.state.selectedLanguage.length !== this.state.languageLists.length){
                              this.setState({ isLanguageChecked: false });
                            }
                          })
                        }else{
                          this.setState({ selectedLanguage: e }, ()=>{
                            if (!this.state.selectedLanguage || this.state.selectedLanguage.length === 0 || this.state.selectedLanguage.length !== this.state.languageLists.length) {
                              this.setState({ isLanguageChecked: false });
                            }
                          })
                        }
                      }}
                    />
                  </div>
                )}
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  className={classes.margin}
                  value={search}
                  style={{ width: '50%', float:'right' }}
                  placeholder="Search Source..."
                  onChange={this.handleSearchChange}
                  InputProps={{
                    startAdornment:(
                      <InputAdornment position="start">
                        <SearchIcon color="primary" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>
            <Table style={{ marginTop: '-10px' }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="default" align="center" style={{ color: '#4581A8'}}>Domain</TableCell>
                  <TableCell padding="default" align="center" style={{ color: '#4581A8'}}>Source String</TableCell>
                  <TableCell padding="default" align="center" style={{ color: '#4581A8'}}>Target String</TableCell>
                  <TableCell padding="default" align="center" style={{ color: '#4581A8'}}>Target Language</TableCell>
                  <TableCell padding="default" align="center" style={{ color: '#4581A8'}}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {unModeratedStrings && unModeratedStrings.map((s,i)=>(
                  <TableRow key={i}>
                    <TableCell padding="default" align="center">{s.apikey}</TableCell>
                    <TableCell padding="default" align="center">{s.source}</TableCell>
                    <TableCell padding="default" align="center">
                      <TextField 
                        id={`target_${i}`}
                        value={s.target}
                        style={{ width: '100%'}}
                        onChange={(e)=>this.handleChangeTarget(e,i)}
                        onFocus={()=>this.initSwalekh(i)}
                      />
                    </TableCell>
                    <TableCell padding="default" align="center">{s.targetLanguage}</TableCell>
                    <TableCell padding="default" align="center">
                      <Button color="primary" variant="contained" onClick={()=>this.onTargetSave(i)} >Save</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination 
                    rowsPerPageOptions={[5,10,25,50,100]}
                    count={unModeratedStrings.length}
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
      </>
    )
  }
}

const TranslatorDashboardConatiner = connect(
  state => ({
    error: state.get('auth').error,
    loading: state.get('auth').loading,
    user: state.get('auth').user
  }),
  dispatch => ({
    authReducer: authReducer.getActions(dispatch)
  })
)(TranslatorDashboard);

export default withStyles(TranslatorDashboardStyle, {withTheme: true})(TranslatorDashboardConatiner);