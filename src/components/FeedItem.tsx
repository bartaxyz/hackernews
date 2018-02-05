import * as React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { AUTH_TOKEN } from '../constants';
import { timeDifferenceForDate } from '../utils';

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

class FeedItem extends React.Component<any, any> {
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN);
    return (
      <div className="feedItem">

        <div>
          <span>{this.props.index + 1}.</span>
          {authToken && (
            <span onClick={() => this._voteForLink()}>▲</span>
          )}
        </div>

        <a className="feedItem__title" href={this.props.link.url} target="_blank">
          {this.props.link.description}
        </a>
        <span className="feedItem__url">
          ({this.props.link.url})
        </span>

        <div>
          {this.props.link.votes.length} votes | by{' '}
          {this.props.link.postedBy
            ? this.props.link.postedBy.name
            : 'Unknown'}{' '}
          {timeDifferenceForDate(this.props.link.createdAt)}
        </div>
      </div>
    );
  }

  _voteForLink = async () => {
    const linkId = this.props.link.id;
    await this.props.voteMutation({
      variables: {
        linkId,
      },
      update: (store: any, opt = { data: { vote } }) => {
        this.props.updateStoreAfterVote(store, opt.data.vote, linkId);
      },
    });
  }
}

export default graphql(VOTE_MUTATION, {
  name: 'voteMutation',
})(FeedItem);
