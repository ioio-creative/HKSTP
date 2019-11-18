import React, {Component} from "react";
import { connect } from "react-redux";
import TweenMax from 'gsap';
import smoothScroll from "../../_component/scroll";
import "../../sass/page/about.scss";

// const usePrevious = (value) => {
//   const ref = useRef();
//   useEffect(() => {
//     ref.current = value;
//   });
//   return ref.current;
// }


class About extends Component {
  static pageName = "about";

  constructor(props) {
    super(props);

    this.pageName = About.pageName;
    this.state = {
      activeId: null
    };
    this.about = null;
    this.smooth = null;
    this.openArticle = this.openArticle.bind(this)
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

  componentDidUpdate(prevProps) {
    if(prevProps.page !== 'about' && this.props.page === 'about'){
      let smooth = new smoothScroll("#about #scrollWrap", (s, y, h) => {
      });
      smooth.on();
      smooth.showScrollBar();
      TweenMax.to(this.about, .6, {delay:1,autoAlpha:1});
    }

    if(this.props.page !== 'about'){
      if(this.state.activeId !== null) this.setState({activeId: null})
    }
  }

  openArticle(e, idx){
    if(this.state.activeId !== idx){
      this.setState({activeId: idx});
      TweenMax.set(e.currentTarget.querySelector('.contentWrap'),{height:e.currentTarget.querySelector('.content').offsetHeight})
    }
    else{
      this.setState({activeId: null});
      TweenMax.set(e.currentTarget.querySelector('.contentWrap'),{height:0})
    }
  }


  render() {
    if(this.props.page !== 'about'){
      return false;
    }

    if (this.props.data) {
      const data = this.props.data['about'];
      const globalData = this.props.data['global'];

      return(
        <div ref={elem => this.about = elem} id="about">
          <div id="scrollWrap">
            <div id="wrap">
              <div id="left">
                <h1 className="cap">About</h1>
              </div>
              <div id="right">
                <div id="lineWrap">
                  <div id="line"></div>
                </div>
                <div id="hof">
                  <h1 className="cap"><span className="blue">HK</span><span className="orange">STP</span></h1>
                </div>
                <div id="intro" className="contentWrap h5">
                  <div className="title">{globalData && globalData.introduction}</div>
                  <div dangerouslySetInnerHTML={{__html:data.introduction}} />
                  <div id="image"><img src={data.image.thumbnail} alt=""/></div>
                </div>

                <ul id="articles">
                  {
                    data.articles.map((value, idx)=>{
                      return (
                        <li key={idx} className={`h5 ${this.state.activeId === idx ? 'active' : ''}`} onClick={(e)=>{this.openArticle(e,idx)}}>
                          <div className="infoWrap">
                            <div dangerouslySetInnerHTML={{__html: value.name}} />
                            <span className="detailBtn">{globalData && globalData.moreDetails}</span>
                          </div>
                          <div className="contentWrap">
                            <div className="content">
                              <div dangerouslySetInnerHTML={{__html: value.details}} />
                            </div>
                          </div>
                        </li>
                      )
                    })
                  }
                  <span id="title" className="cap">{globalData && globalData.article}</span>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    lang: state.lang,
    page: state.page,
    data: state.data ? state.data[state.lang] : null,
    // globalData: state.globalData
  };
};

export default connect(mapStateToProps)(About);
