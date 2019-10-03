import React, { withMemo } from 'react';


export default ({
    isCondidatesFullfilled,
    handleToBecomeCandidate,
    handleToBecomeVoter
}) =>
    <div>
        {
            !isCondidatesFullfilled && <button onClick={handleToBecomeCandidate}>
                Become candidate!
            </button>
        }
        <button onClick={handleToBecomeVoter}>
            Become voter!
        </button>
    </div>
