import * as React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import FeedItem from './FeedItem';

interface Link {
  id: string;
  description: string;
  url: string;
}

const FEED_QUERY = gql`
  query FeedQuery {
    feed {
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

class Feed extends React.Component<any, any> {
  render() {
    if (this.props.feedQuery && this.props.feedQuery.loading) {
      return <div className="feed">Loading...</div>;
    }

    if (this.props.feedQuery && this.props.feedQuery.error) {
      return <div className="feed">Error</div>;
    }

    const linksToRender = this.props.feedQuery.feed.links.filter((link: Link) => {
      return link.description;
    });

    return (
      <div className="feed">
        {linksToRender.map((link: Link, index: string) => (
          <FeedItem key={link.id} />
        ))}
      </div>
    );
  }

  _updateCacheAfterVote = (store: any, createVote: any, linkId: any) => {
    const data = store.readQuery({ query: FEED_QUERY });
    const votedLink = data.feed.links.find((link: Link) => link.id === linkId);
    votedLink.votes = createVote.link.votes;
    store.writeQuery({ query: FEED_QUERY, data });
  }
}

export default graphql(FEED_QUERY, { name: 'feedQuery' }) (Feed);
