import React, { Component } from "react";
import PropTypes from "prop-types";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
// import Html from "../../_component/html";
import { updateImageClickedIdx, updateProjectItems, updateCategory, updateHideProjects } from "../../reducers";
import "../../sass/page/projects.scss";
import TweenMax, {Back, TimelineMax} from 'gsap';
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
    this.heading = null;
  }

  // static actions = () => [fetchDataBy(this.pageName)];

  // static pushData = data => fetchDataSuccess(this.pageName, data);

  // componentDidMount() {
  //   if (!this.props.projectsData && this.props.match.params.lang === this.props.lang) {
  //     this.props.dispatch(fetchDataBy(this.pageName));
  //   }
  // }

  // shouldComponentUpdate(nextProps){
  //   if (nextProps.lang !== this.props.lang) {
  //     this.props.dispatch(fetchDataBy(this.pageName));
  //   }
  //   return true;
  // }


  getInScreenItems(items){
    const inScreenItems = [];
    for(let i=0; i<items.length; i++){
      const elem = items[i];
      const imageWrap = elem.querySelector('.imageWrap');
      const info = elem.querySelector('.info');
      const elemOffset = elem.getBoundingClientRect();

      if(elemOffset.top+imageWrap.offsetHeight+imageWrap.offsetTop+info.offsetHeight > 0 && elemOffset.top-imageWrap.offsetHeight < window.innerHeight){
        inScreenItems.push(elem);
      }
    }
    return inScreenItems;
  }

  slideOutItems(items){
    this.inScreenItems = [];
    this.inScreenItems = this.getInScreenItems(items);
    if(!this.inScreenItems.length)
      this.props.dispatch(updateHideProjects(true))

    TweenMax.staggerTo(this.inScreenItems, .6, {y:-window.innerHeight*2.5, overwrite:'all', ease:Back.easeIn.config(1)},.04,
    ()=>{
      if(this.props.page !== 'projects' && this.props.isStarted){
        this.props.dispatch(updateHideProjects(true))
      }
    });
  }

  slideInItems(prevIdx){
    // TweenMax.set(this.projects,{clearProps:'all'});
    TweenMax.staggerFromTo(this.inScreenItems, 1.6, {y:window.innerHeight*2}, {y:0, overwrite:'all', ease:'Expo.easeOut'},.1);
    if(prevIdx)
      TweenMax.set(this.items[prevIdx], {y:0});
  }
  
  componentDidUpdate(prevProps) {
    if(prevProps.isStarted !== this.props.isStarted && this.props.isStarted){
      this.clickable = true;

      TweenMax.staggerFromTo(this.items, 1, {y:window.innerHeight}, {delay:2, y:0, ease:'Expo.easeOut'},.1);
      TweenMax.fromTo(this.heading, 1, {autoAlpha:0, y:20},{delay:2, autoAlpha:1, y:0, ease: 'Power4.easeOut' });

      if(this.props.data){ 
        if(this.smooth){
          this.smooth.off();
          this.smooth.hideScrollBar();
          this.smooth = null;
        }
        this.smooth = new smoothScroll("#projects #scrollWrap", (s, y, h) => {});
        this.smooth.on();
        this.smooth.showScrollBar();
        if(!this.props.category)
          this.props.dispatch(updateCategory(this.props.data['projects'].categories[0].slug));
      }

      // if(!this.props.projectItems){
        this.props.dispatch(updateProjectItems(this.items));
      // }
    }

    // changed page
    if(this.props.isStarted){
      // others page
      if(prevProps.page === 'projects' && this.props.page !== 'projects'){
        this.slideOutItems(this.items);
        TweenMax.to(this.heading, .6, {autoAlpha:0, y:-40, overwrite:'all', ease: 'Power3.easeOut' });
        
        // turn off scrolling
        if(this.smooth){
          this.smooth.off();
          this.smooth.hideScrollBar();
          this.smooth = null;
        }
      }
      // projects page
      // else if(prevProps.page !== 'projects' && this.props.page === 'projects'){
      //   this.slideInItems(prevProps.imageClickedIdx);
        
      //   // turn on scrolling
      //   this.smooth.on();
      //   this.smooth.showScrollBar();
      // }
    }

    // when clicked image
    if(prevProps.imageClickedIdx !== this.props.imageClickedIdx && this.props.imageClickedIdx !== null){
      this.clickable = false;
      const updatedItems = Array.from(this.items);
      updatedItems.splice(this.props.imageClickedIdx, 1);
      // fade out the info
      TweenMax.to(this.items[this.props.imageClickedIdx].querySelector('.info'), .3, {autoAlpha:0, ease: 'Power4.easeOut'});

      TweenMax.to(this.heading, .6, {autoAlpha:0, y:-40, overwrite:'all', ease: 'Power3.easeOut' });
      // slide out if items are in screen area
      this.slideOutItems(updatedItems);

      // turn off scrolling
      this.smooth.off();
      this.smooth.hideScrollBar();
    }

    // when close
    if(prevProps.imageClickedIdx !== null && this.props.imageClickedIdx === null){
      if(this.items[prevProps.imageClickedIdx]){
        const updatedItems = Array.from(this.items);
        updatedItems.splice(prevProps.imageClickedIdx, 1);

        // slide in to screen area
        this.slideInItems(prevProps.imageClickedIdx);

        this.clickable = true;
        // fade in the info
        TweenMax.to(this.items[prevProps.imageClickedIdx].querySelector('.info'), .8, {autoAlpha:1, ease: 'Power2.easeOut'
          // onComplete:()=>{
          //   this.clickable = true;
          // }
        });
        TweenMax.fromTo(this.heading, 1, {y:40}, {autoAlpha:1, y:0, ease: 'Power3.easeOut' });

        // turn on scrolling
        this.smooth.on();
        this.smooth.showScrollBar();
      }
    }

    // 
    // update category
    // update language
    // back to projects page

    if(prevProps.category !== this.props.category || 
      // prevProps.projectsData !== this.props.projectsData ||
      (prevProps.page !== 'projects' && this.props.page === 'projects' && this.props.isStarted)
    ){
      // fade in the info
      if(prevProps.category !== '' && this.props.imageClickedIdx === null){
        if(this.props.page === 'projects'){
          if(this.smooth) 
            this.smooth.to(0);

          // remove null value
          this.items = this.items.filter(function (el) {
            return el !== null;
          });

          const tl = new TimelineMax();
          tl.set(this.heading, {autoAlpha:0});
          tl.fromTo(this.heading, 1, {y:40},{autoAlpha:1, y:0, ease: 'Power3.easeOut' });

          // if(prevProps.isHideProjects !== this.props.isHideProjects){
            TweenMax.staggerFromTo(this.items, 1, {y:window.innerHeight}, {y:0, ease:'Expo.easeOut'},.1);
            TweenMax.fromTo(this.heading, 1, {autoAlpha:0, y:40},{autoAlpha:1, y:0, ease: 'Power3.easeOut' });

            if(this.smooth){
              this.smooth.off();
              this.smooth.hideScrollBar();
              this.smooth = null;
            }
            this.smooth = new smoothScroll("#projects #scrollWrap", (s, y, h) => {});
            // turn on scrolling
            this.smooth.on();
            this.smooth.showScrollBar();
          // }

          const infos = [];
          for(let i=0; i<this.items.length; i++){
            infos.push(this.items[i].querySelector('.info'));
          }
          TweenMax.staggerFromTo(infos, .6, {autoAlpha: 0}, {delay:.3, autoAlpha: 1, overwrite:'all',ease: 'Power2.easeOut'},.06);

          this.props.dispatch(updateProjectItems(this.items));
        }
      }
    }
  }

  render() {
    if(!this.props.isStarted || this.props.isHideProjects)
      return (null);
    
    if (this.props.data) {
      const data = this.props.data['projects'];
      const filteredData = [];
      this.items = [];
      
      // filtering data by category
      for(let i=0; i<data.items.length; i++){
        const value = data.items[i];
        if(this.props.category === ''){
          if(value.category.slug === data.categories[0].slug)
            filteredData.push(value);
        }
        else{
          if(value.category.slug === this.props.category) 
            filteredData.push(value);
        }
      }

      return (
        <div ref={elem => this.projects = elem} id="projects">
          <div ref={elem => this.scrollWrap = elem} id="scrollWrap" className={!this.props.isStarted ? 'hide' : ''}>
            <p ref={elem => this.heading = elem} id="heading" className="h2" dangerouslySetInnerHTML={{__html: this.props.category && data.categories[data.categories.findIndex(value=> value.slug === this.props.category)].description }}></p>
            <ul id="items">
              {filteredData.map((value, idx) => {
                return (
                  <li key={idx} ref={elem => this.items[idx] = elem} onClick={()=>{this.clickable && this.props.dispatch(updateImageClickedIdx(idx))}}>
                    <div className="info">
                      <div className="logoWrap"><div className={`logo${value.images.logoresize?' small':''}`} style={{backgroundImage:`url('${value.images.logo}')`,backgroundColor:value.images.logoresize?value.images.logocolor:''}}></div></div>
                      <div className="infoWrap">
                        <div className="wrap">
                          <p className="h4">{value.name}</p>
                          <span className="cat h6">{value.category.name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="imageWrap" data-src={value.images.thumbnail}></div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      );
    }
    return <></>;
  }
}

const mapStateToProps = state => {
  return {
    lang: state.lang,
    data: state.data ? state.data[state.lang] : null,
    projectItems: state.projectItems,
    category: state.category,
    isStarted: state.isStarted,
    imageClickedIdx: state.imageClickedIdx,
    page: state.page,
    isHideProjects: state.isHideProjects
  };
};

export default connect(mapStateToProps)(Projects);
