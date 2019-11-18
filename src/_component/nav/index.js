import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { updateLanguage, updateCategory, updatePage, updateHideProjects } from "../../reducers";
import { TweenMax, Back } from "gsap";
// import smoothScroll from '../pagewrap/scroll';

class Nav extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.projectNum = null;
    this.categoryWrap = null;
  }

  getAnotherLanguage() {
    let currentLang = this.props.lang;
    const location = this.props.location;

    // if (this.props.projectSingleData)
    //   return location.pathname
    //     .replace(currentLang, currentLang === "zh" ? "en" : "zh");
    // .replace(
    //   this.props.match.params.title,
    //   this.props.projectSingleData.alternate_languages[0].uid
    // );
    // else
    return location.pathname.replace(
      currentLang,
      currentLang === "zh" ? "en" : "zh"
    );
  }

  componentDidMount(){
    if(this.props.data)
      TweenMax.set(this.categoryWrap, {transitionDelay: '2s'});
  }
  
  componentDidUpdate(prevProps){
    if(this.props.data){
      if(prevProps.isStarted !== this.props.isStarted){
        const target = document.querySelector(`#categoryWrap li:nth-child(1)`);
        const offsetLeft = target.offsetLeft;
        TweenMax.set(this.projectNum, {x:offsetLeft+target.offsetWidth/2-this.projectNum.offsetWidth/2});
        setTimeout(()=>{
          this.categoryWrap.setAttribute('style','');
        },2000)
      }

      if(this.props.projectsData)
        if(prevProps.category === '' && this.props.category === this.props.projectsData.categories[0].slug)
        {}
        else{
          if(prevProps.category !== this.props.category){
            const idx = this.props.projectsData.categories.findIndex(v => v.slug === this.props.category)+1;
            const target = document.querySelector(`#categoryWrap li:nth-child(${idx})`);
            const offsetLeft = target.offsetLeft;
            TweenMax.to(this.projectNum, .4, { x:offsetLeft+target.offsetWidth/2-this.projectNum.offsetWidth/2, ease:Back.easeOut.config(1)});
          }
        }

      if(this.props.page !== 'projects')
        TweenMax.to(this.projectNum, .5, { y:'-100%', autoAlpha:0, ease:'Power4.easeIn'});
      else{
        TweenMax.to(this.projectNum, 1, { delay:.6, y:'0%', autoAlpha:1, ease:'Power4.easeOut'});
      }
    }
  }

  onClick = () => {
    this.props.dispatch(
      updateLanguage(this.props.lang === "zh" ? "en" : "zh")
    )
  }

  render() {
    const currentLang = this.props.lang;
    if (this.props.data) {
      const langData = this.props.langData;
      const homeData = this.props.data['home'];
      const projectsData = this.props.data['projects'];

      return (
        <>
          <div ref={elem => this.hof = elem} id="hof" className={`fixed cap h3 ${!this.props.isStarted ? 'hide' : ''}`}>
          {
            homeData &&
            homeData.title3.split('').map((value, idx)=>{
              return <span key={idx}>{value === " " ? "\u00A0" : value}</span>
            })
          }
          </div>
          <div ref={elem => this.categoryWrap = elem} id="categoryWrap" className={`fixed ${!this.props.isStarted ? 'hide' : this.props.imageClickedIdx !== null ? 'hide' : ''}`}>
            <ul>
            {
              projectsData &&
              projectsData.categories.map((value, idx)=>{
                return <li key={idx} className={this.props.category === value.slug || (this.props.category === '' && idx === 0) ? 'active h3' : 'h3' } 
                onClick={()=> {
                  if(this.props.category !== value.slug)
                    this.props.dispatch(updateCategory(value.slug));

                  if(this.props.page !== 'projects')
                    this.props.dispatch(updatePage('projects'));

                  if(this.props.isHideProjects)
                    this.props.dispatch(updateHideProjects(false))
                }}>
                  {value.name}
                </li>
              })
            }
              <li className="h3" onClick={()=>{if(this.props.page !== 'about') this.props.dispatch(updatePage('about'))}}>About HKSTP</li>
              <span ref={elem => this.projectNum = elem} id="projectNum">{this.props.projectItems && this.props.projectItems.length}</span>
            </ul>
          </div>
          <div id="logo" className="fixed">logo</div>
          <div id="touchToStart" className={`fixed ${this.props.isStarted ? 'hide' : ''}`}>touch here</div>
          <div id="shortDes" className={`fixed h3 ${this.props.isStarted ? 'hide' : ''}`} dangerouslySetInnerHTML={{__html: homeData.shortDes }}></div>
          <Link id="langBtn"  className="fixed"
            to={this.getAnotherLanguage()}
            onClick={this.onClick}
          >
            {langData && currentLang === "zh" ? langData[1].shortDisplay : langData[0].shortDisplay}
          </Link>
        </>
      );
    }
    return <h1>Loading...</h1>;
  }
}

const mapStateToProps = state => {
  return {
    lang: state.lang,
    isStarted: state.isStarted,
    data: state.data ? state.data[state.lang] : null,
    langData: state.langData ? state.langData : null,
    projectItems: state.projectItems,
    category: state.category,
    imageClickedIdx: state.imageClickedIdx,
    page: state.page,
    isHideProjects: state.isHideProjects
  };
};

export default connect(mapStateToProps)(Nav);
