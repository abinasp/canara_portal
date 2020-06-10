import React from 'react';

import { Grid } from '@material-ui/core';

import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import TranslatorDashboardStyle from '../styles';
import authReducer from '../../../redux/modules/auth';

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
      unModeratedStrings: []
    }
    this.initSwalekh = this.initSwalekh.bind(this);
  }

  componentDidMount(){
    this.setState({ unModeratedStrings: dummy });
  }

  componentWillReceiveProps(nextProps){
    if(this.props !== nextProps){
      this.props = nextProps
    }
  }

  handleStringChange(e,i){
    const newState = Object.assign({}, this.state);
    newState.unModeratedStrings[i].target = e.target.value;
    this.setState({ state: newState });
    // console.log(e.target.value,i)
    // this.setState(prevState=> ({
    //   unModeratedStrings:{
    //     ...prevState.unModeratedStrings,
    //     [prevState.unModeratedStrings[i].target]: e.target.value
    //   }
    // }))
  }

  handleStringSave(i){
    let updatedTarget = this.state.unModeratedStrings[i];
    console.log(updatedTarget)
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
    const { unModeratedStrings } =this.state;
    return(
      <>
        <Grid item xs={12}></Grid>
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