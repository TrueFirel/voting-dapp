import React, { PureComponent } from 'react';
import withErrorHandler from '../../utils/withErrorHandler';

export default class CandidatePage extends PureComponent {

    state = {
        votesAmount: null,
        isLoaded: false,
    }

    componentDidMount() {
        this.getAmountOfVotes();
    }

    getAmountOfVotes = withErrorHandler(async () => {
        const { VotingApp, account } = this.props;

        const votesAmount = await VotingApp.getVotesAmount().call({ from: account });
        this.setState(state => ({ ...state, votesAmount, isLoaded: true }))
    }, this);

    render(){
        const { isLoaded, votesAmount } = this.state;

        return isLoaded ? <div>
            Hey, respecting candidate, {votesAmount} people voted for you!
        </div> : <div>

        </div>
    }
}
