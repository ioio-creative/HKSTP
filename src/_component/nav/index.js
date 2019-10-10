import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { updateLanguage } from "../../reducers";
import smoothScroll from '../pagewrap/scroll';

class Nav extends Component {
  constructor(props) {
    super(props);

    this.state = {};
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
    const smooth = new smoothScroll("#categoryWrap ul", (s, y, h) => {
      //onScroll(s, y, h);
    });
    smooth.on();
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
        {/* <Link to={`/${currentLang}/projects/`}>Projects</Link>
        &nbsp; &nbsp; */}
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
              return <li key={idx}>{value}</li>
            })
          }
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
    projectsData: state.projectsData ? state.projectsData : null
  };
};

export default connect(mapStateToProps)(Nav);
