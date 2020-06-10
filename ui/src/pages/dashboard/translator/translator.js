import React from 'react';

import { 
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  Paper,
  TableHead,
  TableRow,
  TextField,
  Button
} from '@material-ui/core';

import { connect } from 'react-redux';
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
      rowsPerPage: 5
    }
    this.initSwalekh = this.initSwalekh.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
  }

  componentDidMount(){
    this.setState({ unModeratedStrings: dummy });
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
    const { unModeratedStrings, page, rowsPerPage } =this.state;
    console.log(unModeratedStrings)
    return(
      <>
        <Grid item xs={12}>
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