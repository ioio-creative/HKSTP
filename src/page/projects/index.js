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
    this.scrollWrap = null;
    this.smooth = null;
    this.inScreenItems = [];
    this.clickable = true;
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
      TweenMax.staggerFromTo(this.items, 1, {y:window.innerHeight}, {delay:2, y:0, ease:'Expo.easeOut'},.1);

      if(this.props.projectsData){ 
        this.smooth = new smoothScroll("#projects #scrollWrap", (s, y, h) => {});
        this.smooth.on();
        this.smooth.showScrollBar();
      }
      if(!this.props.projectItems){
        this.props.dispatch(updateProjectItems(this.items));
      }
    }

    // when clicked image
    if(prevProps.imageClickedIdx !== this.props.imageClickedIdx && this.props.imageClickedIdx !== null){
      this.clickable = false;
      const updatedItems = Array.from(this.items);
      updatedItems.splice(this.props.imageClickedIdx, 1);
      // fade out the info
      TweenMax.to(this.items[this.props.imageClickedIdx].querySelector('.info'), .3, {autoAlpha:0, ease: 'Power4.easeOut'});

      // slide out if items are in screen area
      this.inScreenItems = [];
      for(let i=0; i<updatedItems.length; i++){
        const elem = updatedItems[i];
        const imageWrap = elem.querySelector('.imageWrap');
        const elemOffset = elem.getBoundingClientRect();

        if(elemOffset.top+imageWrap.offsetHeight+imageWrap.offsetTop > 0 && elemOffset.top-imageWrap.offsetHeight < window.innerHeight){
          this.inScreenItems.push(elem);
        }
      }
      TweenMax.staggerTo(this.inScreenItems, .7, {y:-window.innerHeight*2, ease:Back.easeIn.config(1)},.06);

      // turn off scrolling
      this.smooth.off();
      this.smooth.hideScrollBar();
    }

    // when close
    if(prevProps.imageClickedIdx !== null && this.props.imageClickedIdx === null){
      const updatedItems = Array.from(this.items);
      updatedItems.splice(prevProps.imageClickedIdx, 1);
      // slide to screen area
      TweenMax.staggerFromTo(this.inScreenItems, 1.6, {y:window.innerHeight*2}, {y:0, ease:'Expo.easeOut'},.1);
      TweenMax.set(this.items[prevProps.imageClickedIdx], {y:0});

      // fade in the info
      TweenMax.to(this.items[prevProps.imageClickedIdx].querySelector('.info'), .8, {autoAlpha:1, ease: 'Power2.easeOut',
        onComplete:()=>{
          this.clickable = true;
        }
      });

      // turn on scrolling
      this.smooth.on();
      this.smooth.showScrollBar();
    }

    // update category
    if(prevProps.category !== this.props.category){
      this.smooth.to(0);

      // remove null value
      this.items = this.items.filter(function (el) {
        return el != null;
      });

      // fade in the info
      if(prevProps.category !== ''){
        const infos = [];
        for(let i=0; i<this.items.length; i++){
          infos.push(this.items[i].querySelector('.info'));
        }
        TweenMax.staggerFromTo(infos, .6, {autoAlpha: 0}, {delay:.3, autoAlpha: 1, overwrite:'all',ease: 'Power2.easeOut'},.06);
      }
      
      this.props.dispatch(updateProjectItems(this.items));
    }
  }

  render() {
    if(!this.props.isStarted)
      return false;
    
    if (this.props.projectsData) {
      const data = this.props.projectsData;
      const filteredData = [];
      this.items = [];
      
      // filtering data by category
      for(let i=0; i<data.items.length; i++){
        const value = data.items[i];
        if(this.props.category === ''){
          if(value.category === data.categories[0])
            filteredData.push(value);
        }
        else{
          if(value.category === this.props.category) 
            filteredData.push(value);
        }
      }
    

      return (
        <div ref={elem => this.projects = elem} id="projects">
          <div ref={elem => this.scrollWrap = elem} id="scrollWrap" className={!this.props.isStarted ? 'hide' : ''}>
            <ul id="items">
              {filteredData.map((value, idx) => {
                return (
                  <li key={idx} ref={elem => this.items[idx] = elem}>
                    <div className="info">
                      <div className="logoWrap"><div className="logo"><span>{idx}</span></div></div>
                      <div className="infoWrap">
                        <div className="wrap">
                          <p>{value.name}</p>
                          <span className="cat h3">{value.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="imageWrap" onClick={()=>{this.clickable && this.props.dispatch(updateImageClickedIdx(idx))}} data-src={value.images.thumbnail}></div>
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
    category: state.category,
    isStarted: state.isStarted,
    imageClickedIdx: state.imageClickedIdx
  };
};

export default connect(mapStateToProps)(Projects);
