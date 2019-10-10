import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Html from "../../_component/html";
import { fetchDataBy, fetchDataSuccess } from "../../reducers";
import "../../sass/page/projects.scss";
import TweenMax from 'gsap';

class Projects extends Component {
  static pageName = "projects";

  static propTypes = {
    lang: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.pageName = Projects.pageName;
    this.state = {};
    this.items = [];
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
  
  componentDidUpdate(prevProps) {
    if(prevProps.isStarted !== this.props.isStarted){
      TweenMax.staggerFromTo(this.items, 1.6, {y:window.innerHeight}, {delay:2, y:0, autoAlpha:1, ease:'Expo.easeOut'},.1);
    }
  }

  render() {
    if (this.props.projectsData) {
      // const currentLang = this.props.lang;
      const data = this.props.projectsData;

      return (
        <Html
          id="projects"
          title="Projects"
          description={`This is Projects page!`}
        >
          <ul id="items">
            {data.items.map((value, idx) => {
              return (
                <li key={idx} ref={elem => this.items[idx] = elem}>
                  <span>{value.name}</span>
                  <div className="imageWrap"></div>
                </li>
              );
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
    projectsData: state.projectsData,
    isStarted: state.isStarted
  };
};

export default connect(mapStateToProps)(Projects);
