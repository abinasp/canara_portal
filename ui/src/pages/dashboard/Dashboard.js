import React, { useState } from "react";
import {
  Grid,
  LinearProgress,
  Select,
  OutlinedInput,
  MenuItem,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel
} from "@material-ui/core";
import moment from 'moment';
import toastr from 'toastr';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  LineChart,
  Line,
  Area,
  PieChart,
  Pie,
  Cell,
  YAxis,
  XAxis,
} from "recharts";
import MUIDataTable from "mui-datatables";
// styles
import DashboardStyle from "./styles";
import CRUDUser from '../dashboard/components/crud/crud_user';

// components
import mock from "./mock";
import Widget from "../../components/Widget";
import PageTitle from "../../components/PageTitle";
import { Typography } from "../../components/Wrappers";
import Dot from "../../components/Sidebar/components/Dot";
import Table from "./components/Table/Table";
import BigStat from "./components/BigStat/BigStat";


import authReducer  from "../../redux/modules/auth";

const unmoderatedStrings = [
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

const mainChartData = getMainChartData();
const PieChartData = [
  { name: "Group A", value: 400, color: "primary" },
  { name: "Group B", value: 300, color: "secondary" },
  { name: "Group C", value: 300, color: "warning" },
  { name: "Group D", value: 200, color: "success" },
];

class Dashboard extends React.Component{
  constructor(props){
    super(props);
    this.state={
      mainChartState: "monthly",
      openUser: false,
      editUser: false,
      deleteuser: false,
      name: '',
      role: 'translator',
      username: '',
      password: '',
      selectedUser: '',
      unModeratedStrings: []
    }
    this.handleUserChange = this.handleUserChange.bind(this);
    this.onCreateUser = this.onCreateUser.bind(this);
    this.onEditUser = this.onEditUser.bind(this);
    this.onDeleteUser = this.onDeleteUser.bind(this);
    this.onEditSave = this.onEditSave.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.initSwalekh = this.initSwalekh.bind(this);
  }

  componentDidMount(){
    this.props.authReducer.checkApi().then(res=>{
      if(res){
        const { user } = this.props;
        if(user.role === 'admin'){
          this.props.authReducer.getUserLists();
        }
      }
    });
    this.setState({unModeratedStrings: unmoderatedStrings})
  }

  componentWillReceiveProps(nextProps){
    if(this.props !== nextProps){
      this.props = nextProps
    }
  }
  handleUserChange(e){
    this.setState({ [e.target.name] : e.target.value});
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

  onCreateUser(){
    const { name, username, password, role } = this.state;
    if(!name.trim()){
      return toastr.warning('Name is required')
    }
    if(!username.trim()){
      return toastr.warning('Username is required');
    }
    if(!password.trim()){
      return toastr.warning('Password is required');
    }
    this.props.authReducer.createUser({name, username, password,role }).then((res)=>{
      if(res && res.success){
        this.props.authReducer.getUserLists().then(()=>{
          this.setState({ openUser: false, name: '', username: '', password: '' })
        });
      }
    })
  }

  onEditSave(){
    const { name, username, role, selectedUser } = this.state;
    if(!name.trim()){
      return toastr.warning('Name is required')
    }
    if(!username.trim()){
      return toastr.warning('Username is required');
    }
    const { apikey } = selectedUser;
    const updatedUser = { apikey, name, username };
    this.props.authReducer.updateUser({updatedUser}).then((res)=>{
      if(res && res.success){
        this.props.authReducer.getUserLists().then(()=>{
          this.setState({ openUser: false, editUser: false, selectedUser: '', name: '', username: '', password: '' })
        });
      }
    })
  }

  deleteUser(){
    const { selectedUser } = this.state;
    const { apikey } = selectedUser;
    this.props.authReducer.deleteUser({apikey}).then((res)=>{
      if(res && res.success){
        this.props.authReducer.getUserLists().then(()=>{
          this.setState({ openUser: false, editUser: false, deleteuser: false, selectedUser: '', name: '', username: '', password: '' })
        });
      }
    })
  }

  onCloseModal(){
    this.setState({ openUser: false, editUser: false, deleteuser: false, selectedUser: '', name: '', username: '', password: '' })
  }

  onEditUser(user){
    this.setState({ name: user.name, username: user.username, password: '', selectedUser: user }, ()=>{
      this.setState({ editUser: true });
    })
  }

  onDeleteUser(user){
    this.setState({ selectedUser: user }, ()=>{
      this.setState({ deleteuser: true });
    })
  }


  render(){
    const { classes, theme, userLists, user } = this.props;
    const { mainChartState, openUser, name, username, password, editUser,deleteuser, unModeratedStrings } =this.state;
    console.log(this.state)
    let arr = userLists && userLists.map(u=>{
      return[
        u.name,
        u.username,
        moment(u.createdAt).format('DD-MM-YYYY HH:MM:SS'),
        <EditIcon style={{color: '#4581A8', cursor: 'pointer' }} onClick={()=>this.onEditUser(u)} />,
        <DeleteIcon style={{color: 'rgb(210, 73, 18)', cursor: 'pointer' }} onClick={() => this.onDeleteUser(u)} />
      ]
    });
    return(
      <>
      <PageTitle title="Dashboard"/>
      <Grid container spacing={4}>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget
            title="Visits Today"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <div className={classes.visitsNumberContainer}>
              <Typography size="xl" weight="medium">
                12, 678
              </Typography>
              <LineChart
                width={55}
                height={30}
                data={[
                  { value: 10 },
                  { value: 15 },
                  { value: 10 },
                  { value: 17 },
                  { value: 18 },
                ]}
                margin={{ left: theme.spacing(2) }}
              >
                <Line
                  type="natural"
                  dataKey="value"
                  stroke={theme.palette.success.main}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </div>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid item>
                <Typography color="text" colorBrightness="secondary">
                  Registrations
                </Typography>
                <Typography size="md">860</Typography>
              </Grid>
              <Grid item>
                <Typography color="text" colorBrightness="secondary">
                  Sign Out
                </Typography>
                <Typography size="md">32</Typography>
              </Grid>
              <Grid item>
                <Typography color="text" colorBrightness="secondary">
                  Rate
                </Typography>
                <Typography size="md">3.25%</Typography>
              </Grid>
            </Grid>
          </Widget>
        </Grid>
        <Grid item lg={3} md={8} sm={6} xs={12}>
          <Widget
            title="App Performance"
            upperTitle
            className={classes.card}
            bodyClass={classes.fullHeightBody}
          >
            <div className={classes.performanceLegendWrapper}>
              <div className={classes.legendElement}>
                <Dot color="warning" />
                <Typography
                  color="text"
                  colorBrightness="secondary"
                  className={classes.legendElementText}
                >
                  Integration
                </Typography>
              </div>
              <div className={classes.legendElement}>
                <Dot color="primary" />
                <Typography
                  color="text"
                  colorBrightness="secondary"
                  className={classes.legendElementText}
                >
                  SDK
                </Typography>
              </div>
            </div>
            <div className={classes.progressSection}>
              <Typography
                size="md"
                color="text"
                colorBrightness="secondary"
                className={classes.progressSectionTitle}
              >
                Integration
              </Typography>
              <LinearProgress
                variant="determinate"
                value={30}
                classes={{ barColorPrimary: classes.progressBar }}
                className={classes.progress}
              />
            </div>
            <div>
              <Typography
                size="md"
                color="text"
                colorBrightness="secondary"
                className={classes.progressSectionTitle}
              >
                SDK
              </Typography>
              <LinearProgress
                variant="determinate"
                value={55}
                classes={{ barColorPrimary: classes.progressBar }}
                className={classes.progress}
              />
            </div>
          </Widget>
        </Grid>
        <Grid item lg={3} md={8} sm={6} xs={12}>
          <Widget
            title="Server Overview"
            upperTitle
            className={classes.card}
            bodyClass={classes.fullHeightBody}
          >
            <div className={classes.serverOverviewElement}>
              <Typography
                color="text"
                colorBrightness="secondary"
                className={classes.serverOverviewElementText}
              >
                60% / 37°С / 3.3 Ghz
              </Typography>
              <div className={classes.serverOverviewElementChartWrapper}>
                <ResponsiveContainer height={50} width="99%">
                  <AreaChart data={getRandomData(10)}>
                    <Area
                      type="natural"
                      dataKey="value"
                      stroke={theme.palette.secondary.main}
                      fill={theme.palette.secondary.light}
                      strokeWidth={2}
                      fillOpacity="0.25"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className={classes.serverOverviewElement}>
              <Typography
                color="text"
                colorBrightness="secondary"
                className={classes.serverOverviewElementText}
              >
                54% / 31°С / 3.3 Ghz
              </Typography>
              <div className={classes.serverOverviewElementChartWrapper}>
                <ResponsiveContainer height={50} width="99%">
                  <AreaChart data={getRandomData(10)}>
                    <Area
                      type="natural"
                      dataKey="value"
                      stroke={theme.palette.primary.main}
                      fill={theme.palette.primary.light}
                      strokeWidth={2}
                      fillOpacity="0.25"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className={classes.serverOverviewElement}>
              <Typography
                color="text"
                colorBrightness="secondary"
                className={classes.serverOverviewElementText}
              >
                57% / 21°С / 3.3 Ghz
              </Typography>
              <div className={classes.serverOverviewElementChartWrapper}>
                <ResponsiveContainer height={50} width="99%">
                  <AreaChart data={getRandomData(10)}>
                    <Area
                      type="natural"
                      dataKey="value"
                      stroke={theme.palette.warning.main}
                      fill={theme.palette.warning.light}
                      strokeWidth={2}
                      fillOpacity="0.25"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Widget>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget title="Revenue Breakdown" upperTitle className={classes.card}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <ResponsiveContainer width="100%" height={144}>
                  <PieChart margin={{ left: theme.spacing(2) }}>
                    <Pie
                      data={PieChartData}
                      innerRadius={45}
                      outerRadius={60}
                      dataKey="value"
                    >
                      {PieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={theme.palette[entry.color].main}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Grid>
              <Grid item xs={6}>
                <div className={classes.pieChartLegendWrapper}>
                  {PieChartData.map(({ name, value, color }, index) => (
                    <div key={color} className={classes.legendItemContainer}>
                      <Dot color={color} />
                      <Typography style={{ whiteSpace: "nowrap" }}>
                        &nbsp;{name}&nbsp;
                      </Typography>
                      <Typography color="text" colorBrightness="secondary">
                        &nbsp;{value}
                      </Typography>
                    </div>
                  ))}
                </div>
              </Grid>
            </Grid>
          </Widget>
        </Grid>
        <Grid item xs={12}>
          <Widget
            bodyClass={classes.mainChartBody}
            header={
              <div className={classes.mainChartHeader}>
                <Typography
                  variant="h5"
                  color="text"
                  colorBrightness="secondary"
                >
                  Daily Line Chart
                </Typography>
                <div className={classes.mainChartHeaderLabels}>
                  <div className={classes.mainChartHeaderLabel}>
                    <Dot color="warning" />
                    <Typography className={classes.mainChartLegentElement}>
                      Tablet
                    </Typography>
                  </div>
                  <div className={classes.mainChartHeaderLabel}>
                    <Dot color="primary" />
                    <Typography className={classes.mainChartLegentElement}>
                      Mobile
                    </Typography>
                  </div>
                  <div className={classes.mainChartHeaderLabel}>
                    <Dot color="primary" />
                    <Typography className={classes.mainChartLegentElement}>
                      Desktop
                    </Typography>
                  </div>
                </div>
                <Select
                  value={mainChartState}
                  onChange={e => this.setState({ mainChartState: e.target.value })}
                  input={
                    <OutlinedInput
                      labelWidth={0}
                      classes={{
                        notchedOutline: classes.mainChartSelectRoot,
                        input: classes.mainChartSelect,
                      }}
                    />
                  }
                  autoWidth
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </div>
            }
          >
            <ResponsiveContainer width="100%" minWidth={500} height={350}>
              <ComposedChart
                margin={{ top: 0, right: -15, left: -15, bottom: 0 }}
                data={mainChartData}
              >
                <YAxis
                  ticks={[0, 2500, 5000, 7500]}
                  tick={{ fill: theme.palette.text.hint + "80", fontSize: 14 }}
                  stroke={theme.palette.text.hint + "80"}
                  tickLine={false}
                />
                <XAxis
                  tickFormatter={i => i + 1}
                  tick={{ fill: theme.palette.text.hint + "80", fontSize: 14 }}
                  stroke={theme.palette.text.hint + "80"}
                  tickLine={false}
                />
                <Area
                  type="natural"
                  dataKey="desktop"
                  fill={theme.palette.background.light}
                  strokeWidth={0}
                  activeDot={false}
                />
                <Line
                  type="natural"
                  dataKey="mobile"
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                />
                <Line
                  type="linear"
                  dataKey="tablet"
                  stroke={theme.palette.warning.main}
                  strokeWidth={2}
                  dot={{
                    stroke: theme.palette.warning.dark,
                    strokeWidth: 2,
                    fill: theme.palette.warning.main,
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Widget>
        </Grid>
        {mock.bigStat.map(stat => (
          <Grid item md={4} sm={6} xs={12} key={stat.product}>
            <BigStat {...stat} />
          </Grid>
        ))}
        {user && user.role === 'translator' && (
          <Grid item xs={12}>
            <MUIDataTable
              title="Unmoderated Strings"
              data={unModeratedStrings}
              columns={[{
                name: "source",
                label: "Source",
                options: {
                 filter: false,
                }
               },
               {
                name: "target",
                label: "Target",
                options: {
                 filter: false,
                 customBodyRender: (value, tableMeta, updateValue) => (
                  <TextField 
                    id={`target_${tableMeta.rowIndex}`} 
                    value={value} 
                    style={{ width: '100%'}}
                    onChange={e=> {
                      console.log('ok')
                      this.handleStringChange(e, tableMeta.rowIndex)
                    }}
                    onFocus={()=>this.initSwalekh(tableMeta.rowIndex)} 
                  />
                 )
                }
               },
               {
                name: "targetLanguage",
                label: "Target Language",
                options: {
                 filter: true,
                }
               },
               {
                name: "sourceLanguage",
                label: "Source Langauge",
                options: {
                 filter: true,
                }
               },
               {
                name: "action",
                label: "Action",
                options: {
                 filter: false,
                 customBodyRender: (value, tableMeta, updateValue) => (
                  <Button variant="contained" color="primary"
                   onClick={()=>this.handleStringSave(tableMeta.rowIndex)}
                  >Save</Button>
                )
                }
               },
              ]}
              options={{
                filterType: 'checkbox',
                print: false,
                download: false,
                sort: false
              }}
          />
          </Grid>
        )}
        {user && user.role==='admin' && userLists && userLists.length > 0 && (
          <>
            <div style={{ width: '100%'}}>
              <Button
                style={{ float: 'right', margin: '0 16px'}}
                classes={{ root: classes.button }}
                variant="contained"
                size="large"
                color="primary"
                onClick={()=> this.setState({ openUser: true })}
              >
                Create User
              </Button>
            </div>
            <Grid item xs={12}>
              <MUIDataTable
                title="Translators List"
                data={arr}
                columns={['Name', 'Username', 'Created On', 'Edit', 'Delete']}
                options={{
                  filter: false,
                  print: false,
                  download: false,
                  selectableRows: false,
                  sort: false
                }}
              />
            </Grid>
          </>
        )}
        {openUser && (
          <CRUDUser 
            action="create"
            openUser={openUser}
            classes={classes}
            handleInputChange={this.handleUserChange}
            handleModalChange={this.onCloseModal}
            handleSave={this.onCreateUser}
            crudUser={{
              name,
              username,
              password
            }}
          />
        )}
        {editUser && (
          <CRUDUser 
            action="edit"
            openUser={editUser}
            classes={classes}
            handleInputChange={this.handleUserChange}
            handleModalChange={this.onCloseModal}
            handleSave={this.onEditSave}
            crudUser={{
              name,
              username,
              password
            }}
          />
        )}
        {deleteuser && (
          <CRUDUser 
            action="delete"
            openUser={deleteuser}
            classes={classes}
            handleInputChange={this.handleUserChange}
            handleModalChange={this.onCloseModal}
            handleSave={this.deleteUser}
            crudUser={{
              name,
              username,
              password
            }}
          />
        )}
      </Grid>
    </>
    )
  }
}


// #######################################################################
function getRandomData(length, min, max, multiplier = 10, maxDiff = 10) {
  var array = new Array(length).fill();
  let lastValue;

  return array.map((item, index) => {
    let randomValue = Math.floor(Math.random() * multiplier + 1);

    while (
      randomValue <= min ||
      randomValue >= max ||
      (lastValue && randomValue - lastValue > maxDiff)
    ) {
      randomValue = Math.floor(Math.random() * multiplier + 1);
    }

    lastValue = randomValue;

    return { value: randomValue };
  });
}

function getMainChartData() {
  var resultArray = [];
  var tablet = getRandomData(31, 3500, 6500, 7500, 1000);
  var desktop = getRandomData(31, 1500, 7500, 7500, 1500);
  var mobile = getRandomData(31, 1500, 7500, 7500, 1500);

  for (let i = 0; i < tablet.length; i++) {
    resultArray.push({
      tablet: tablet[i].value,
      desktop: desktop[i].value,
      mobile: mobile[i].value,
    });
  }

  return resultArray;
}

const DashboardConatiner = connect(
  state => ({
    error: state.get('auth').error,
    loading: state.get('auth').loading,
    user: state.get('auth').user,
    userLists: state.get('auth').userLists
  }),
  dispatch => ({
    authReducer: authReducer.getActions(dispatch)
  })
)(Dashboard);

export default withStyles(DashboardStyle, {withTheme: true})(DashboardConatiner);
