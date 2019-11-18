import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { updateLanguage } from "../../../src/reducers";
// import smoothScroll from "./scroll";

import Nav from "../nav";
import Home from "../../page/home";
import Projects from "../../page/projects";
import ProjectSingle from "../../page/single/project";
import About from "../../page/about";

import ThreejsBg from "../ThreejsBg";

// const usePrevious = (value) => {
//   const ref = useRef();
//   useEffect(() => {
//     ref.current = value;
//   });
//   return ref.current;
// }

class PageWrap extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.bodyWrap = null;
  }


  // shouldComponentUpdate(nextProps){
  //   if(this.props.lang !== nextProps.lang){
  //     this.props.dispatch(fetchGlobalData());
  //     return true;
  //   }
  //   return false;
  // }

  componentDidMount() {
    // this.props.dispatch(fetchGlobalData());
    if(this.props.match.params.lang !== this.props.lang)
      this.props.dispatch(updateLanguage(this.props.match.params.lang));
  }

  render(){
    return (
      <>
        <Nav {...this.props} />
        <div ref={elem => this.bodyWrap = elem} id="bodyWrap" className={`body_wrap ${this.props.lang}`}>
          <Switch>
            <Route
              exact
              path="/:lang/"
              render={props => {
                return <>
                  <Home {...props} />
                  <Projects {...props} />
                  <ProjectSingle {...props} />
                  <About {...props} />
                </>
              }}
            />
          </Switch>
        </div>
        <ThreejsBg {...this.props} />
      </>
    )
  }
}

const mapStateToProps = state => {
  return { 
    lang: state.lang,
    isStarted: state.isStarted,
    page: state.page
    // imageClickedIdx: state.imageClickedIdx
  };
};

export default connect(mapStateToProps)(PageWrap);
