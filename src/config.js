const dev={
    API_URL:"https://ecom-sandras-g6abfyg2azbqekf8.southeastasia-01.azurewebsites.net//api"
}

const prod={
    API_URL:"https://ecom-sandras-g6abfyg2azbqekf8.southeastasia-01.azurewebsites.net//api"
}
const config=process.env.NODE_ENV==='development'?dev:prod
export default  config