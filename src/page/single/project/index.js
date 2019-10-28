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

  // static actions = title => [fetchDataBy(this.pageName, this.query, title)];

  // static pushData(data) {
  //   return fetchDataSuccess(this.pageName, data);
  // }

  componentWillMount() {
    // if (!this.props.projectSingleData)
    //   this.props.dispatch(
    //     fetchDataBy(this.pageName, this.query, this.props.match.params.title)
    //   );
    // else if (this.props.projectSingleData.uid !== this.props.match.params.title)
    //   this.props.dispatch(
    //     fetchDataBy(this.pageName, this.query, this.props.match.params.title)
    //   );
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.location.key !== this.props.location.key) {
    //   this.props.dispatch(
    //     fetchDataBy(this.pageName, this.query, nextProps.match.params.title)
    //   );
    // }
  }
  
  componentDidUpdate(prevProps) {
    if(this.props.imageClickedIdx !== null){
      if(prevProps.imageClickedIdx !== this.props.imageClickedIdx){
        if(this.projectSingle){
          this.smooth = new smoothScroll("#projectSingle #scrollWrap", (s, y, h) => {});
          this.smooth.on();
          this.smooth.showScrollBar();
          TweenMax.set(this.projectSingle,{y:'0%'});
          TweenMax.to(this.projectSingle, .6, {delay:1,autoAlpha:1});
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
    
    if(this.props.projectsData){
      return (
        <div ref={elem => this.projectSingle = elem} id="projectSingle">
          <div id="scrollWrap">
            <div id="closeBtn" onClick={()=>{
              TweenMax.to(this.projectSingle, .3, {autoAlpha:0,onComplete:()=>{
                this.props.dispatch(updateImageClickedIdx(null))
              }})
            }}>Close button</div>

            <div id="content">
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
              <div>single content single content single content single content single content</div>
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
