const dev={
    API_URL:"https://ecomwebapi-gsbbgmgbfubhc8hk.canadacentral-01.azurewebsites.net/api"
}

const prod={
    API_URL:"https://ecomwebapi-gsbbgmgbfubhc8hk.canadacentral-01.azurewebsites.net/api"
}
const config=process.env.NODE_ENV==='development'?dev:prod
export default  config