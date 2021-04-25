import React from 'react';

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Checkbox
} from "@material-ui/core";
import ReactSelect from 'react-select';
import config from '../../../../config';

export default class CRUDUser extends React.Component{
  constructor(props){
    super(props);
    this.state={
      selectedLanguage: [],
      isLanguageChecked: false,
      languageLists: [],
      menuOpenLang: false,
    }
    this.languageAllChange = this.languageAllChange.bind(this);
  }

  componentDidMount(){
    const newOptions = [], selectLangs=[];
    const { crudUser, action } = this.props;
    if(action && action === 'edit'){
      if(crudUser && crudUser.languages && crudUser.languages.length > 0){
        crudUser.languages.forEach(lang=>{
          if (lang !== 'english') {
            selectLangs.push({
              label: lang[0].toUpperCase() + lang.slice(1),
              value: lang
            });
          }
        });
      }
    }
    config.defaultLangMap.forEach(lang=>{
      if (lang !== 'english') {
        newOptions.push({
          label: lang[0].toUpperCase() + lang.slice(1),
          value: lang
        });
      }
    });
    this.setState({ languageLists: newOptions, selectedLanguage: selectLangs }, ()=>{
      if(this.state.selectedLanguage.length === this.state.languageLists.length){
        this.setState({ isLanguageChecked: true });
      }
    });
  }

  languageAllChange() {
    const { handleLangChange } = this.props;
    this.setState({ isLanguageChecked: !this.state.isLanguageChecked }, () => {
      if (this.state.isLanguageChecked) {
        this.setState({ selectedLanguage: this.state.languageLists }, ()=>{
          handleLangChange(this.state.selectedLanguage);
        });
      } else {
        this.setState({ selectedLanguage: [] }, ()=>{
          handleLangChange(this.state.selectedLanguage);
        });
      }
    });
  }

  render(){
    const { action, openUser, handleInputChange, handleModalChange, handleSave, classes, crudUser , handleLangChange } = this.props;
    return(
        <Dialog open={openUser} onClose={handleModalChange} aria-labelledby="form-dialog-title" fullWidth maxWidth="sm">
          <DialogTitle id="form-dialog-title">{action==="create" ? "Create User": action === "edit" ? "Edit User" : "Delete User"}</DialogTitle>
          <DialogContent>
            {action === "delete" ? (
              <DialogContentText>Are you sure to delete this selected user ? </DialogContentText>
            ):(
              <>
                <TextField
                  margin="dense"
                  name="role"
                  label="Role"
                  value="Translator"
                  type="text"
                  disabled
                  fullWidth
                  />
                  <TextField
                    margin="dense"
                    name="name"
                    label="Name"
                    type="text"
                    value={crudUser.name}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    margin="dense"
                    name="username"
                    label="Username"
                    type="text"
                    value={crudUser.username}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  {action==="create" && (
                    <TextField
                      margin="dense"
                      name="password"
                      label="Password"
                      type="password"
                      value={crudUser.password}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  )}
                  <div style={{ margin: '8px' }}>
                    <FormControlLabel 
                      control={<Checkbox style={{ color: '#1956ad', marginRight: '4px', padding: '0' }} checked={this.state.isLanguageChecked} onChange={this.languageAllChange}/>}
                      label="Select All Languages"
                    />
                  </div>
                  <div style={{ margin: '8px 0' }}>
                    <ReactSelect 
                      isMulti
                      options={this.state.languageLists}
                      classNamePrefix="select"
                      placeholder="Select Target Language *"
                      menuIsOpen={this.state.menuOpenLang}
                      onFocus={() => this.setState({ menuOpenLang: true })}
                      onBlur={() => this.setState({ menuOpenLang: false })}
                      value={this.state.selectedLanguage}
                      style={{ padding: '5px' }}
                      tabSelectsValue={false}
                      onChange={e=>{
                        if(!e){
                          this.setState({ selectedLanguage: [] }, ()=>{
                            if(!this.state.selectedLanguage || this.state.selectedLanguage.length === 0 || this.state.selectedLanguage.length !== this.state.languageLists.length){
                              this.setState({ isLanguageChecked: false });
                            }
                            handleLangChange(this.state.selectedLanguage);
                          })
                        }else{
                          this.setState({ selectedLanguage: e }, ()=>{
                            if (!this.state.selectedLanguage || this.state.selectedLanguage.length === 0 || this.state.selectedLanguage.length !== this.state.languageLists.length) {
                              this.setState({ isLanguageChecked: false });
                            }
                            handleLangChange(this.state.selectedLanguage);
                          })
                        }
                      }}
                    />
                  </div>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalChange} classes={{ root: classes.button }}
                variant="contained"
                size="large"
                color={action==="delete" ? "primary" : "secondary"}>
              Cancel
            </Button>
            <Button onClick={handleSave} classes={{ root: classes.button }}
                variant="contained"
                size="large"
                color={action==="delete" ? "secondary": "primary"}>
              {action==="delete" ? "Delete" : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
    )
  }
}