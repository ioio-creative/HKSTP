import React, { Component } from "react";
import PropTypes from "prop-types";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
// import Html from "../../_component/html";
import { fetchDataBy, fetchDataSuccess, updateImageClickedIdx, updateProjectItems } from "../../reducers";
import "../../sass/page/projects.scss";
import TweenMax, {Back} from 'gsap';
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
    this.inScreenItems = [];
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
      for(let i=0; this.items[i]; i++){
        TweenMax.set(this.items[i], {paddingTop:((Math.random()*50+20) + ((i%2) * (Math.random()*50+50))) / 16 +'rem'});
      }
      TweenMax.staggerFromTo(this.items, 1.6, {y:window.innerHeight}, {delay:2, y:0, autoAlpha:1, ease:'Expo.easeOut'},.1);

      if(this.props.projectsData){ 
        this.smooth = new smoothScroll("#projects", (s, y, h) => {});
        this.smooth.on();
        this.smooth.showScrollBar();
      }
      if(!this.props.projectItems){
        this.props.dispatch(updateProjectItems(this.items));
      }
    }

    // when clicked image
    if(prevProps.imageClickedIdx !== this.props.imageClickedIdx && this.props.imageClickedIdx !== null){
      const updatedItems = Array.from(this.items);
      updatedItems.splice(this.props.imageClickedIdx, 1);


      this.inScreenItems = [];
      for(let i=0; i<updatedItems.length; i++){
        const elem = updatedItems[i];
        const imageWrap = elem.querySelector('.imageWrap');
        const elemOffset = elem.getBoundingClientRect();

        if(elemOffset.top+imageWrap.offsetHeight+imageWrap.offsetTop > 0 && elemOffset.top < window.innerHeight){
          this.inScreenItems.push(elem);
        }
      }

      TweenMax.staggerTo(this.inScreenItems, 1, {y:-this.projects.offsetHeight*2, ease:Back.easeIn.config(.5)},.06);

      this.smooth.off();
      this.smooth.hideScrollBar();
    }

    // when close
    if(prevProps.imageClickedIdx !== null && this.props.imageClickedIdx === null){
      const updatedItems = Array.from(this.items);
      updatedItems.splice(prevProps.imageClickedIdx, 1);
      TweenMax.staggerFromTo(this.inScreenItems, 1.6, {y:this.projects.offsetHeight}, {y:0, autoAlpha:1, ease:'Expo.easeOut'},.1);
      TweenMax.set(this.items[prevProps.imageClickedIdx], {y:0, ease:'Power4.easeOut'});
      
      this.smooth.on();
      this.smooth.showScrollBar();
    }
  }

  render() {
    if(!this.props.isStarted)
      return false;
    
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
                    <div className="imageWrap" onClick={()=>{this.props.dispatch(updateImageClickedIdx(idx))}} data-src={value.images.thumbnail}></div>
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
