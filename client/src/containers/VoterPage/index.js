import React, { PureComponent } from 'react';
import withErrorHandler from '../../utils/withErrorHandler';

export default class VoterPage extends PureComponent {

    state = {
        candidateVote: null,
        proposedCandidates: null,
        isLoaded: false,
    };

    componentDidMount() {
        const { isCondidatesFullfilled } = this.props;

        isCondidatesFullfilled && this.getCandidates();
    }

    voteForCandidate = (address) => withErrorHandler(async () => {
        const { VotingApp, account, afterCandidatesGetting } = this.props;

        await VotingApp.voteForCandidate(address).send({ from: account });
        await this.getCandidates();
        await afterCandidatesGetting();
    }, this);

    getCandidates = withErrorHandler(async () => {
        const { VotingApp, account } = this.props;

        const candidateVote =  await VotingApp.getVotedCandidate().call({ from: account });
        if(candidateVote !== '0x0000000000000000000000000000000000000000') {
            this.setState(state => ({...state, candidateVote, isLoaded: true}));
            return;
        }
        const proposedCandidates = await VotingApp.getCandidates().call();
        this.setState(state => ({ ...state, proposedCandidates, isLoaded: true}));
    }, this);

    render() {
        const { isCondidatesFullfilled } = this.props;
        const { isLoaded, candidateVote, proposedCandidates } = this.state;

        return <div>{
            !isCondidatesFullfilled ?
                <div>
                    Dear voter, please wait for vote beginning.
                </div> :
                <div>
                    {
                        isLoaded ? <div>
                            {
                                !!candidateVote ?
                                    <div>
                                        Hey, you already voted for {candidateVote}
                                    </div> :
                                    <div>
                                        {
                                            !!proposedCandidates && !!proposedCandidates.length ? <div>
                                                {
                                                    proposedCandidates.map((candidateAddress, key) => <div key={key}>
                                                        <span>{candidateAddress}</span>
                                                        <button onClick={this.voteForCandidate(candidateAddress)}>Vote!</button>
                                                    </div>)
                                                }
                                            </div> : <div>
                                                Whoops, something went wrong :/
                                            </div>
                                        }
                                    </div>
                            }
                        </div> : <div><img src={`${process.env.PUBLIC_URL}/assets/output.svg`}/></div>
                    }
                </div>

        }

        </div>
    }
}
