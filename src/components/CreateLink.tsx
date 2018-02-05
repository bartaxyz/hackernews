import * as React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;

class CreateLink extends React.Component<any, any> {
  state = {
    description: '',
    url: '',
  };

  render() {
    return (
      <div className="form">
        <label className="field field--25">
          <span className="field__label">Title</span>
          <input
            className="field__input field__input--text"
            value={this.state.description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder=""
          />
        </label>
        <label className="field field--75">
          <span className="field__label">URL</span>
          <input
            className="field__input field__input--text"
            value={this.state.url}
            onChange={e => this.setState({ url: e.target.value })}
            type="text"
            placeholder=""
          />
        </label>
        <button className="button" onClick={() => this._createLink()}>Submit</button>
      </div>
    );
  }

  _createLink = async () => {
    const { description, url } = this.state;
    await this.props.postMutation({
      variables: {
        description,
        url,
      },
    });
    this.props.history.push('/');
  }
}

export default graphql(POST_MUTATION, { name: 'postMutation' })(CreateLink);
