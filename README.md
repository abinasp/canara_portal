## Canara bank CBS localization
- This is a webapp for canara bank, which has been built in ```MERN stack```.
- In this application we show all the translated strings which is localized by canara bank.
- It consists of admin dahboard, translator dashboard, listing of all transaltors in admin dashbaord, listsing of all moderated and unmoderated strings and some dashboard statistics.
- All the localized strings are available for editing and saving.

## Technical requirements
- ```node (10.16.0)```
- ```npm (6.9.0)```
- ```yarn (1.21.1)``` (preferrable for installing the packages)
- ```mongodb```

## Setup
- Clone the repository by using https or ssh.
- Navigate to the repository folder and Go to ```canara-services```, run command ```yarn``` or ```npm install```.
- Start mongodb service and connect to it by using ```systemctl``` or ```mongo service```. It should start in 27017 port.
- Create DB called ```canara-bank-localization```.
- Create an ```users``` collection. Add an admin user by inserting the below document.
        ```
            "name" : "ADMIN Canara",
            "username" : "canara@admin",
            "password" : "$2b$10$1Yak30TfcBg1o2zxMp6KG.5J28ne/KtQElxDC8jPnt0xqmtRRC/Se",
            "role" : "admin",
            "apikey" : "d9dd6027-2c5f-4f87-9f4f-bfd21b87a26d",
            "createdAt" : 1591697989874.0,
            "updateAt" : 1591697989874.0
        ```   
- Admin username:- ```canara@admin``` and password:- ```canara@123```.
- Then run ```yarn watch``` or ```npm watch```. It should serve in 8001 port.
- Go to ```ui``` folder and run command ```yarn``` or ```npm install```.
- After installing all the packages run ```yarn start``` or ```npm start```. It should start serving in 8000 port.

## Notes
- For fetching strings we are using locman api which is ruuning in ```172.20.1.9:8989```.
- For editing and saving strings ```172.20.1.9:8080```.