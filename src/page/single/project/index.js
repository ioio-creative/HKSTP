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
    if(prevProps.projectsData !== this.props.projectsData){
      this.smooth = new smoothScroll("#projectSingle", (s, y, h) => {});
      this.smooth.on();
      this.smooth.showScrollBar();
    }

    if(this.props.imageClickedIdx !== null){
      if(prevProps.imageClickedIdx !== this.props.imageClickedIdx){
        // console.log(prevProps.imageClickedIdx, this.props.imageClickedIdx);
        TweenMax.set('#projectSingle',{y:'0%'});
      }
    }
    else if(prevProps.imageClickedIdx > -1 && this.props.imageClickedIdx === null){
      TweenMax.set('#projectSingle',{y:'100%'});
      // console.log(this.props.imageClickedIdx);
    }
  }

  render() {
    if (this.props.projectsData) {
      // const data = this.props.projectsData.items[this.props.imageClickedIdx];

      return (
        <div id="projectSingle">
          <div id="closeBtn" onClick={()=>{this.props.dispatch(updateImageClickedIdx(null))}}>Close button</div>
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
