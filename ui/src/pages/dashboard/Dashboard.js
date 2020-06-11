import React, { useState } from "react";
import {
  Grid,
  LinearProgress,
  Select,
  OutlinedInput,
  MenuItem,
} from "@material-ui/core";

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

import AdminDashboard from './admin/admin';
import TranslatorDashboard from './translator/translator';



// styles
import DashboardStyle from "./styles";

// components
import mock from "./mock";
import Widget from "../../components/Widget";
import PageTitle from "../../components/PageTitle";
import { Typography } from "../../components/Wrappers";
import Dot from "../../components/Sidebar/components/Dot";
import Table from "./components/Table/Table";
import BigStat from "./components/BigStat/BigStat";


import authReducer  from "../../redux/modules/auth";

const mainChartData = getMainChartData();
const PieChartData = [
  { name: "Confirmed", value: 400, color: "primary" },
  { name: "Unconfirmed", value: 300, color: "secondary" },
  { name: "Machine", value: 300, color: "warning" },
  { name: "Translated", value: 200, color: "success" },
];

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
  }

  componentWillReceiveProps(nextProps){
    if(this.props !== nextProps){
      this.props = nextProps
    }
  }

  render(){
    const { classes, theme, user } = this.props;
    const { mainChartState } =this.state;
    return(
      <>
      <PageTitle title="Dashboard"/>
      <Grid container spacing={4}>
        {user && user.role === 'admin' && (
          <>
            <Grid item lg={4} md={4} sm={6} xs={12}>
          <Widget
            title="Total Strings"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <div className={classes.visitsNumberContainer}>
              <Typography size="xl" weight="medium">
                500,123
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
                  Translated
                </Typography>
                <Typography size="md">496,520</Typography>
              </Grid>
              <Grid item>
                <Typography color="text" colorBrightness="secondary">
                  Pending
                </Typography>
                <Typography size="md">8555</Typography>
              </Grid>
              <Grid item>
                <Typography color="text" colorBrightness="secondary">
                  Efficiency
                </Typography>
                <Typography size="md">99.25%</Typography>
              </Grid>
            </Grid>
          </Widget>
        </Grid>
        <Grid item lg={4} md={8} sm={6} xs={12}>
          <Widget
            title="API Health"
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
                  Unmoderated Strings
                </Typography>
              </div>
              <div className={classes.legendElement}>
                <Dot color="primary" />
                <Typography
                  color="text"
                  colorBrightness="secondary"
                  className={classes.legendElementText}
                >
                  Moderated Strings
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
                Efficiency (97.1%)
              </Typography>
              <LinearProgress
                variant="determinate"
                value={95}
                classes={{ barColorPrimary: classes.progressBar }}
                className={classes.progress}
              />
            </div>
            {/* <div>
              <Typography
                size="md"
                color="text"
                colorBrightness="secondary"
                className={classes.progressSectionTitle}
              >
                Efficiency (77%)
              </Typography>
              <LinearProgress
                variant="determinate"
                value={77}
                classes={{ barColorPrimary: classes.progressBar }}
                className={classes.progress}
              />
            </div> */}
          </Widget>
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Widget title="Wordcounts" upperTitle className={classes.card}>
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
                
        </>
        )}
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
                  Strings Graph with Language wise
                </Typography>
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

            <ResponsiveContainer width="100%" minWidth={500} height={350}>
              <ComposedChart
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
              </ComposedChart>
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
        {user && user.role==='admin' && (
          <AdminDashboard />
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
  }),
  dispatch => ({
    authReducer: authReducer.getActions(dispatch)
  })
)(Dashboard);

export default withStyles(DashboardStyle, {withTheme: true})(DashboardConatiner);
