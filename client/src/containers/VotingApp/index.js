import React, {PureComponent} from 'react';
import VotingManagerContract from '../../contracts/VotingApp';
import WithContract from '../../containers/HOC\'s/WithContract';
import RoleSelection from '../../components/RoleSelection';
import withErrorHandler from '../../utils/withErrorHandler';
import VoterPage from '../VoterPage';
import CandidatePage from '../CandidatePage';

const styles = {
    votingContainer: {
        display: "flex",
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignContent: 'center',
        alignItems: 'center',
    },
    votingHeader: {
        fontSize: '48px',
        fontFamily: 'Roboto',
        opacity: '0.9',
    },
    votingSmallText: {
        fontSize: '36px',
        opacity: '0.8',
        fontFamily: 'Roboto light',
    },
    congratsText: {
        color: 'green',
        fontFamily: 'Roboto light',
        fontSize: '30px',
        marginBottom: '15px',
        marginTop: '15px'
    },
    winningResult: {
        textAlign: 'center'
    }
}

class VotingManager extends PureComponent {
    state = {
        isLoaded: false,
        latestTransactionError: null,
        isVotingEnded: null,
        votingResults: null
    };

    componentDidMount() {
        this.startWorkflow();
    };

    startWorkflow = async () => {
        const isVotingEnded = await this.isVotingEnded();

        if (isVotingEnded) {
            await this.getEndedVotingResults();
        } else {
            await this.checkRoleAndCandidatesFullfilling();
        }
    };

    markWinners = (votingResults) => {
        let winningIndexes = [];
        let currentMax = 0;

        votingResults.forEach(({votes}, index) => {
            if (votes > currentMax) {
                currentMax = votes
                winningIndexes = [];
                winningIndexes.push(index)
            } else if (votes === currentMax) {
                winningIndexes.push(index)
            }
        });

        return votingResults.map((result, index) => winningIndexes.includes(index) ? ({
            ...result,
            isWinner: true
        }) : result)
    }

    getEndedVotingResults = withErrorHandler(async () => {
        const {VotingApp} = this.props;
        const result = await VotingApp.getVotingResult().call();
        const votingResults = this.markWinners(result[0].map((address, i) => ({address, votes: result[1][i]})));
        this.setState(state => ({...state, votingResults, isVotingEnded: true, isLoaded: true}))
    }, this);

    isVotingEnded = withErrorHandler(async () => {
        const {VotingApp} = this.props;

        return VotingApp.isVotingEnded().call();
    }, this);

    checkRoleAndCandidatesFullfilling = withErrorHandler(async () => {
        const {VotingApp, account} = this.props;
        const role = await VotingApp.checkRole().call({from: account});
        const isCondidatesFullfilled = await VotingApp.isCondidatesFullfilled().call();
        this.setState(state => ({...state, role, isCondidatesFullfilled, isLoaded: true}));
    }, this);

    handleToBecomeCandidate = withErrorHandler(
        async () => {
            const {VotingApp, account} = this.props;

            const result = await VotingApp.becomeCandidate().send({from: account});
            await this.startWorkflow();
        }, this);

    handleToBecomeVoter = withErrorHandler(
        async () => {
            const {VotingApp, account} = this.props;

            const result = await VotingApp.becomeVoter().send({from: account});
            await this.startWorkflow();
        }, this);

    render() {
        const {VotingApp, account} = this.props;
        const {isLoaded, role, votingResults} = this.state;

        return (
            <div style={styles.votingContainer}>
                <div style={styles.votingHeader}>
                    Welcome to the voting application!
                </div>
                {
                    isLoaded ? <div>

                        {
                            isLoaded && !!votingResults && !!votingResults.length ?
                                <div>
                                    <div style={styles.congratsText}>
                                        CONGRATULATIONS! Voting is ended!
                                    </div>
                                    {
                                        votingResults.map(({address, votes, isWinner}, key) => <div
                                            style={styles.winningResult} key={key}>
                                            {isWinner && '🏆'}
                                            <span>{address === account ? 'You' : address} : </span>
                                            <span>{votes}</span>
                                            {isWinner && '🏆'}
                                        </div>)
                                    }
                                </div> :
                                <div>
                                    {
                                        role === 'null' &&
                                        <RoleSelection
                                            isCondidatesFullfilled={this.state.isCondidatesFullfilled}
                                            handleToBecomeCandidate={this.handleToBecomeCandidate}
                                            handleToBecomeVoter={this.handleToBecomeVoter}
                                        />
                                    }
                                    {
                                        role === 'candidate' &&
                                        <CandidatePage
                                            VotingApp={VotingApp}
                                            account={account}
                                        />
                                    }
                                    {
                                        role === 'voter' &&
                                        <VoterPage
                                            VotingApp={VotingApp}
                                            account={account}
                                            afterCandidatesGetting={this.startWorkflow}
                                            isCondidatesFullfilled={this.state.isCondidatesFullfilled}
                                        />
                                    }
                                </div>
                        }
                    </div> : <div><img src={`${process.env.PUBLIC_URL}/assets/output.svg`} alt=""/></div>
                }
            </div>
        );
    }
}

export default WithContract(VotingManager)(VotingManagerContract)
