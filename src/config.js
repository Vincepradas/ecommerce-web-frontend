const dev={
    REACT_APP_API_URL:`${process.env.REACT_APP_API_URL}`
}

const prod={
    REACT_APP_API_URL:`${process.env.REACT_APP_API_URL}`
}

const config=process.env.NODE_ENV==='development'?dev:prod
export default  config