import * as React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import { AUTH_TOKEN } from '../constants';
import { timeDifferenceForDate } from '../utils';

interface PostedBy {
  name: string;
}
interface Link {
  id: string;
  description: string;
  url: string;
  votes: [string];
  postedBy: PostedBy;
  createdAt: Date;
}

interface Props {
  name: () => any;
  index: number;
  link: Link;
  voteMutation: (options: any) => void;
  updateStoreAfterVote: (store: any, vote: any, linkId: string) => void;
}

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

class FeedItem extends React.Component<Props> {
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN);
    return (
      <div className="feedItem">

        <div className="feedItem__vote">
          <span className="feedItem__vote__index">{this.props.index + 1}.</span>
          {authToken &&
            <button className="feedItem__vote__action" onClick={() => this._voteForLink()}>▲</button>
          }
        </div>

        <a className="feedItem__title" href={this.props.link.url} target="_blank">
          {this.props.link.description}
        </a>
        <span className="feedItem__url">
          ({this.props.link.url})
        </span>
        
        <br />

        <small className="feedItem__subtext">
          {this.props.link.votes.length} votes · posted by{' '}
          {this.props.link.postedBy
            ? this.props.link.postedBy.name
            : 'A little nobody'}{' '}
          {timeDifferenceForDate(this.props.link.createdAt)}
        </small>
      </div>
    );
  }

  _voteForLink = async () => {
    const linkId = this.props.link.id;
    await this.props.voteMutation({
      variables: {
        linkId,
      },
      update: (store: any, opt: any) => {
        this.props.updateStoreAfterVote(store, opt.data.vote, linkId);
      },
    });
  }
}

export default compose(
  graphql(VOTE_MUTATION, { name: 'voteMutation' }),
)(FeedItem);
