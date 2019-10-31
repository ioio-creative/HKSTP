import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import '../../../sass/page/projectSingle.scss';
import { updateImageClickedIdx } from "../../../reducers";
import smoothScroll from "../../../_component/scroll";

// import Html from "../../../_component/html";
import { TweenMax } from "gsap";

class ProjectSingle extends Component {
  static pageName = "projectSingle";

  static propTypes = {
    lang: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.pageName = ProjectSingle.pageName;
    this.state = {};
    this.smooth = null;
    this.projectSingle = null;
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
  }
  
  componentDidUpdate(prevProps) {
    if(this.props.imageClickedIdx !== null){
      if(prevProps.imageClickedIdx !== this.props.imageClickedIdx){
        if(this.projectSingle){
          this.smooth = new smoothScroll("#projectSingle #scrollWrap", (s, y, h) => {});
          this.smooth.on();
          this.smooth.showScrollBar();
          TweenMax.set(this.projectSingle,{y:'0%'});
          TweenMax.to(this.projectSingle, .6, {delay:2,autoAlpha:1});
        }
      }
    }
    else if(prevProps.imageClickedIdx > -1 && this.props.imageClickedIdx === null){
      if(this.projectSingle){
        this.smooth.off();
        this.smooth.hideScrollBar();
        this.smooth = null;
        TweenMax.set(this.projectSingle,{y:'100%'});
      }
      // console.log(this.props.imageClickedIdx);
    }
  }

  render() {
    if(this.props.imageClickedIdx === null)
      return false;
    
    const data = this.props.projectsData.items[this.props.imageClickedIdx];
    if(this.props.projectsData){
      return (
        <div ref={elem => this.projectSingle = elem} id="projectSingle">
          <div id="scrollWrap">
            <div id="closeBtn" onClick={()=>{
              TweenMax.to(this.projectSingle, .3, {autoAlpha:0})
              this.props.dispatch(updateImageClickedIdx(null))
            }}><span></span><span></span></div>

            <div id="wrap">
              <div id="info">
                <div id="logo"></div>
                <div id="infoContent">
                  <h1>{data.name}</h1>
                  <div id="cat">{data.category}</div>
                </div>
              </div>
              <div id="content">
                <div id="intro" className="contentItem">
                  <div className="title">Introduction</div>
                  {data.details.introduction}
                </div>
                <div id="awards" className="contentItem">
                  <div className="title">Awards</div>
                  <ul>
                    <li><div className="year">2019</div><div className="awradsTitle">awrads title</div></li>
                    <li><div className="year">2019</div><div className="awradsTitle">awrads title</div></li>
                    <li><div className="year">2019</div><div className="awradsTitle">awrads title</div></li>
                  </ul>
                </div>
              </div>
            </div>
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
    projectsData: state.projectsData ? state.projectsData : null,
    imageClickedIdx: state.imageClickedIdx
  };
};

export default connect(mapStateToProps)(ProjectSingle);
