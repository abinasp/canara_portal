import React from "react";
import {
  Grid
} from "@material-ui/core";

import { withStyles } from '@material-ui/core/styles';
import TranslateIcon from '@material-ui/icons/Translate';
import GroupIcon from '@material-ui/icons/Group';
import { connect } from "react-redux";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  YAxis,
  XAxis,
  BarChart,
  CartesianGrid,
  Tooltip,
  CartesianAxis,
  Bar
} from "recharts";

import TranslatorDashboard from './translator/translator';



// styles
import DashboardStyle from "./styles";

// components
import Widget from "../../components/Widget";
import PageTitle from "../../components/PageTitle";
import { Typography } from "../../components/Wrappers";
import Dot from "../../components/Sidebar/components/Dot";

import config from "../../config";
import UserLists from "./admin/userlists";
import StringsList from "./admin/strings";
import authReducer  from "../../redux/modules/auth";
import dashboardReducer from "../../redux/modules/dashboard";

class Dashboard extends React.Component{
  constructor(props){
    super(props);
    this.state={
      mainChartState: "monthly"
    }
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
    this.getStringsCountForDashboard();
  }

  getStringsCountForDashboard(){
    const { dashboardReducer } = this.props;
    dashboardReducer.getStringsCount();
  }

  componentWillReceiveProps(nextProps){
    if(this.props !== nextProps){
      this.props = nextProps
    }
  }

  render(){
    const { classes, theme, user, stringsCount, userList } = this.props;
    const { mainChartState } =this.state;
    let barData = [];
    let totalStrings= 0,
        unStrings =0, moStrings = 0;

    if(stringsCount && stringsCount.length > 0){
      stringsCount.map(s=>{
        totalStrings += (s.moderated + s.unmdorated);
        unStrings += s.unmdorated;
        moStrings += s.moderated;
        // if(user.role === "translator"){
        //   if(user.languages && user.languages.indexOf(s.targetLanguage) > -1){
        //     barData.push({
        //       Language: config.reverseLanguageCodeMap[s.targetLanguage].toUpperCase(),
        //       Moderated: s.moderated,
        //       Unmoderated: s.unmdorated
        //     });
        //   }
        // }else{
        //   barData.push({
        //     Language: config.reverseLanguageCodeMap[s.targetLanguage].toUpperCase(),
        //     Moderated: s.moderated,
        //     Unmoderated: s.unmdorated
        //   });
        // }
        barData.push({
          Language: config.reverseLanguageCodeMap[s.targetLanguage].toUpperCase(),
          Moderated: s.moderated,
          Unmoderated: s.unmdorated
        });
      })
    }
    return(
      <>
      <PageTitle title="Dashboard"/>
      <Grid container spacing={4}>
        {user && user.role === 'admin' && (
          <>
            <Grid style={{ height: "200px" }} item lg={4} md={4} sm={6} xs={12}>
              <Widget
                title="Total strings"
                upperTitle
                disableWidgetMenu={true}
                className={classes.card}
              >
              <div>
              <div style={{ float: 'left'}} className={classes.visitsNumberContainer}>
                <Typography size="xl" weight="medium">
                  {totalStrings}
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
              <div style={{ float: 'right' }}>
                <TranslateIcon color="primary" style={{ fontSize: '48px' }} />
              </div>
              </div>
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Typography color="text" colorBrightness="secondary">
                    Moderated
                  </Typography>
                  <Typography size="md">{moStrings}</Typography>
                </Grid>
                <Grid item>
                  <Typography color="text" colorBrightness="secondary">
                    Unmoderated
                  </Typography>
                  <Typography size="md">{unStrings}</Typography>
                </Grid>
                <Grid item>
                  {/* <Typography color="text" colorBrightness="secondary">
                    Efficiency
                  </Typography>
                  <Typography size="md">99.25%</Typography> */}
                </Grid>
              </Grid>
            </Widget>
              <Widget
                title="Total users"
                upperTitle
                flag="users-wrapper"
                disableWidgetMenu={true}
                className={classes.card}
                >
                <div>
                  <div style={{ float: 'left' }} className={classes.visitsNumberContainer}>
                    <Typography size="xl" weight="medium">
                      {userList.length}
                    </Typography>
                  </div>
                  <div style={{ float: 'right' }}>
                    <GroupIcon color="primary" style={{ fontSize: '48px' }} />
                  </div>
                </div>
              </Widget>
            </Grid>        
        </>
        )}
        <Grid item xs={8}>
          <Widget
            bodyClass={classes.mainChartBody}
            header={
              <div style={{ justifyContent: 'center'}} className={classes.mainChartHeader}>
                <div className={classes.mainChartHeaderLabels}>
                  <div className={classes.mainChartHeaderLabel}>
                    <Dot color="warning" />
                    <Typography className={classes.mainChartLegentElement}>
                      Moderated Strings
                    </Typography>
                  </div>
                  <div className={classes.mainChartHeaderLabel}>
                    <Dot color="primary" />
                    <Typography className={classes.mainChartLegentElement}>
                      Unmoderated Strings
                    </Typography>
                  </div>
                </div>
              </div>
            }
          >

            <ResponsiveContainer width="100%" minWidth={500} height={295}>
              {barData && barData.length > 0 ? (
                <BarChart data={barData}>
                  <XAxis dataKey="Language" tickLine={false} />
                  <YAxis axisLine={false} tickSize={3} tickLine={false} tick={{ stroke: 'none' }} />
                  <CartesianGrid vertical={false} strokeDasharray="2 2" />
                  <CartesianAxis />
                  <Tooltip />
                  <Bar dataKey="Moderated" fill={theme.palette.warning.main} />
                  <Bar dataKey="Unmoderated" fill={theme.palette.primary.main} />
                </BarChart>
              ):(<p>No data found</p>)}
              {/* <ComposedChart
                margin={{ top: 0, right: -15, left: -15, bottom: 0 }}
                data={mainChartData}
              >
                <YAxis
                  ticks={[0, 2500, 5000, 7500]}
                  // tick={{ fill: theme.palette.text.hint + "80", fontSize: 14 }}
                  // stroke={theme.palette.text.hint + "80"}
                  tickLine={false}
                />
                <XAxis
                  tickFormatter={i => i + 1}
                  // tick={{ fill: theme.palette.text.hint + "80", fontSize: 14 }}
                  // stroke={theme.palette.text.hint + "80"}
                  tickLine={false}
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
              </ComposedChart> */}
            </ResponsiveContainer>
          </Widget>
        </Grid>
        {/* {mock.bigStat.map(stat => (
          <Grid item md={4} sm={6} xs={12} key={stat.product}>
            <BigStat {...stat} />
          </Grid>
        ))} */}
        {user && user.role === 'translator' && (
          <TranslatorDashboard />
        )}
        {user && user.role === 'admin' && (
          <StringsList />
        )}
        {/* {user && user.role==='admin' && (
          <AdminDashboard />
        )} */}
      </Grid>
    </>
    )
  }
}

const DashboardConatiner = connect(
  state => ({
    error: state.get('auth').error,
    loading: state.get('auth').loading,
    user: state.get('auth').user,
    stringsCount: state.get('dashboard').stringsCount,
    userList: state.get('auth').userLists
  }),
  dispatch => ({
    authReducer: authReducer.getActions(dispatch),
    dashboardReducer: dashboardReducer.getActions(dispatch)
  })
)(Dashboard);

export default withStyles(DashboardStyle, {withTheme: true})(DashboardConatiner);
