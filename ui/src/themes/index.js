import defaultTheme from "./default";

import { createMuiTheme } from "@material-ui/core";

const overrides = {
  typography: {
    fontFamily: "Open-Sans !important",
    h1: {
      fontSize: "3rem",
      fontFamily: "Open-Sans !important"
    },
    h2: {
      fontSize: "2rem",
      fontFamily: "Open-Sans !important"
    },
    h3: {
      fontSize: "1.64rem",
      fontFamily: "Open-Sans !important"
    },
    h4: {
      fontSize: "1.5rem",
      fontFamily: "Open-Sans !important"
    },
    h5: {
      fontSize: "1.285rem",
      fontFamily: "Open-Sans !important"
    },
    h6: {
      fontSize: "1.142rem",
      fontFamily: "Open-Sans !important"
    },
  },
};

export default {
  default: createMuiTheme({ ...defaultTheme, ...overrides }),
};
