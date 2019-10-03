import React, { PureComponent } from 'react';
import VotingManagerContract from '../../contracts/VotingApp';

class VotingPage extends PureComponent {
    componentDidMount() {
        const { web3 } = this.props;
    }

    render(){
        return (<div>
            HELLO MEN!
        </div>);
    }
}

export default VotingPage;
