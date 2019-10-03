export default (executable, context) => async (e) => {
    try {
        return await executable(e);
    } catch(latestTransactionError) {
        console.log(latestTransactionError)
        context.setState({ latestTransactionError })
    }
}
