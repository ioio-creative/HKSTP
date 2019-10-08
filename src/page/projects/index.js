import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Html from "../../_component/html";
import { fetchDataBy, fetchDataSuccess } from "../../reducers";
import "../../sass/page/projects.scss";

class Projects extends Component {
  static pageName = "projects";

  static propTypes = {
    lang: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.pageName = Projects.pageName;
    this.state = {};
  }

  static actions = () => [fetchDataBy(this.pageName)];

  static pushData = data => fetchDataSuccess(this.pageName, data);

  componentWillMount() {
    if (!this.props.projectsData) {
      this.props.dispatch(fetchDataBy(this.pageName));
    }
    // else {
    //   if (this.props.projectsData[0].lang.split("-")[0] !== this.props.lang)
    //     this.props.dispatch(fetchDataBy(this.pageName));
    // }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.lang !== this.props.lang) {
      this.props.dispatch(fetchDataBy(this.pageName));
    }
  }

  render() {
    if (this.props.projectsData) {
      const currentLang = this.props.lang;
      const data = this.props.projectsData;

      return (
        <Html
          id="projects"
          title="Projects"
          description={`This is Projects page!`}
        >
          <ul id="items">
            {data.items.map((value, idx) => {
              return <li key={idx}>{value.name}</li>;
            })}
          </ul>
        </Html>
      );
    }
    return <h1>Loading...</h1>;
  }
}

const mapStateToProps = state => {
  return {
    lang: state.lang,
    projectsData: state.projectsData
  };
};

export default connect(mapStateToProps)(Projects);
