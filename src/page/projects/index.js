import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Html from "../../_component/html";
import { fetchDataBy, fetchDataSuccess, updateImageClickedIdx, updateProjectItems } from "../../reducers";
import "../../sass/page/projects.scss";
import TweenMax from 'gsap';
import smoothScroll from "../../_component/scroll";

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
    this.projects = null;
    this.smooth = null;
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
    if(prevProps.projectsData !== this.props.projectsData){
      console.log(this.projects);
      this.smooth = new smoothScroll("#projects", (s, y, h) => {});
      this.smooth.on();
      this.smooth.showScrollBar();
    }

    if(!this.props.projectItems){
      this.props.dispatch(updateProjectItems(this.items));
    }
    
    if(prevProps.isStarted !== this.props.isStarted){
      TweenMax.staggerFromTo(this.items, 1.6, {y:window.innerHeight}, {delay:2, y:0, autoAlpha:1, ease:'Expo.easeOut'},.1);
    }

    // when clicked image
    if(prevProps.imageClickedIdx !== this.props.imageClickedIdx && this.props.imageClickedIdx !== null){
      // const updatedItems = Array.from(this.items);
      // updatedItems.splice(this.props.imageClickedIdx, 1);
      TweenMax.staggerTo(this.items, 1, {y:-document.getElementById('projects').offsetHeight*1.5, ease:'Expo.easeInOut'},.1);

      this.smooth.off();
      this.smooth.hideScrollBar();
    }

    // when close
    if(prevProps.imageClickedIdx !== null && this.props.imageClickedIdx === null){
      // console.log(this.props.imageClickedIdx)
      // const updatedItems = Array.from(this.items);
      // updatedItems.splice(prevProps.imageClickedIdx, 1);
      TweenMax.staggerFromTo(this.items, 1.6, {y:window.innerHeight}, {delay:2, y:0, autoAlpha:1, ease:'Expo.easeOut'},.1);
      
      this.smooth.on();
      this.smooth.showScrollBar();
    }
  }

  render() {
    if (this.props.projectsData) {
      // const currentLang = this.props.lang;
      const data = this.props.projectsData;

      return (
        <div ref={elem => this.projects = elem} id="projects">
          <div className={`scrollWrap ${!this.props.isStarted ? 'hide' : ''}`}>
            <ul id="items">
              {data.items.map((value, idx) => {
                return (
                  <li key={idx} ref={elem => this.items[idx] = elem}>
                    {/* <span>{value.name}</span> */}
                    <div className="imageWrap" style={{marginTop: Math.random()* 100}} onClick={()=>{this.props.dispatch(updateImageClickedIdx(idx))}} data-src={value.images.thumbnail}></div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      );
    }
    return <h1>Loading...</h1>;
  }
}

const mapStateToProps = state => {
  return {
    lang: state.lang,
    projectsData: state.projectsData,
    projectItems: state.projectItems,
    isStarted: state.isStarted,
    imageClickedIdx: state.imageClickedIdx
  };
};

export default connect(mapStateToProps)(Projects);
