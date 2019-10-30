import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { updateLanguage, updateCategory } from "../../reducers";
import { TweenMax, Back } from "gsap";
// import smoothScroll from '../pagewrap/scroll';

class Nav extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.projectNum = null;
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

  
  componentDidUpdate(prevProps){
    if(prevProps.category === '' && this.props.category === this.props.projectsData.categories[0])
    {}
    else{
      if(prevProps.category !== this.props.category){
        const idx = this.props.projectsData.categories.indexOf(this.props.category)+1;
        const target = document.querySelector(`#categoryWrap li:nth-child(${idx})`);
        const offsetLeft = target.offsetLeft;
        TweenMax.to(this.projectNum, .4, { x:offsetLeft+target.offsetWidth/2-this.projectNum.offsetWidth/2, ease:Back.easeOut.config(1.7)});
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
    const homeData = this.props.homeData;
    const projectsData = this.props.projectsData;

    return (
      <>
        <div ref={elem => this.hof = elem} id="hof" className={`fixed cap ${!this.props.isStarted ? 'hide' : ''}`}>
        {
          homeData &&
          homeData.title3.split('').map((value, idx)=>{
            return <span key={idx}>{value === " " ? "\u00A0" : value}</span>
          })
        }
        </div>
        <div id="categoryWrap" className={`fixed ${!this.props.isStarted ? 'hide' : ''}`}>
          <ul>
          {
            projectsData &&
            projectsData.categories.map((value, idx)=>{
              return <li key={idx} className={this.props.category === value || (this.props.category === '' && idx === 0) ? 'active' : '' } onClick={()=> this.props.dispatch(updateCategory(value))}>
                {value}
              </li>
            })
          }
            <li>About HKSTP</li>
            <span ref={elem => this.projectNum = elem} id="projectNum">{this.props.projectItems && this.props.projectItems.length}</span>
          </ul>
        </div>
        <div id="logo" className="fixed">logo</div>
        <div id="touchToStart" className="fixed">touch here</div>
        <div id="shortDes" className="fixed h6">{ homeData && homeData.shortDes }</div>
        <Link id="langBtn"  className="fixed"
          to={this.getAnotherLanguage()}
          onClick={this.onClick}
        >
          {currentLang === "zh" ? "Eng" : "中"}
        </Link>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    lang: state.lang,
    isStarted: state.isStarted,
    homeData: state.homeData ? state.homeData : null,
    projectsData: state.projectsData ? state.projectsData : null,
    projectItems: state.projectItems,
    category: state.category
  };
};

export default connect(mapStateToProps)(Nav);
