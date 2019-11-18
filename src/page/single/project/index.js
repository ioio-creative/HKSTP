import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { updateImageClickedIdx } from "../../../reducers";
import smoothScroll from "../../../_component/scroll";
import QRCode from "qrcode.react";
import '../../../sass/page/projectSingle.scss';

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
    this.closeBtn = null;
  }
  
  componentDidUpdate(prevProps) {
    if(this.props.data){
      if(this.props.imageClickedIdx !== null){
        if(prevProps.imageClickedIdx !== this.props.imageClickedIdx){
          if(this.projectSingle){
            this.smooth = new smoothScroll("#projectSingle #scrollWrap", (s, y, h) => {
              if(this.closeBtn)
                TweenMax.set(this.closeBtn,{force3D:true, y: Math.max(0, -y)});
            });
            this.smooth.on();
            this.smooth.showScrollBar();
            // TweenMax.set(this.projectSingle,{y:'0%'});
            TweenMax.to(this.projectSingle, .6, {delay:2,autoAlpha:1});
          }
        }
      }
      else if(prevProps.imageClickedIdx > -1 && this.props.imageClickedIdx === null){
        if(this.projectSingle){
          this.closeBtn = null;
          this.smooth.off();
          this.smooth.hideScrollBar();
          this.smooth = null;
          TweenMax.set(this.projectSingle,{y:'100%'});
        }
        // console.log(this.props.imageClickedIdx);
      }
    }
  }

  render() {
    if(this.props.imageClickedIdx === null)
      return false;
    
    const data = this.props.data['projects'].items[this.props.imageClickedIdx];
    const globalData = this.props.data['global'];


    if(this.props.data){
      return (
        <div ref={elem => this.projectSingle = elem} id="projectSingle">
          <div id="scrollWrap">
            <div ref={elem => this.closeBtn = elem} id="closeBtn" onClick={()=>{
              TweenMax.to(this.projectSingle, .3, {autoAlpha:0})
              this.props.dispatch(updateImageClickedIdx(null))
            }}><span></span><span></span></div>

            <div id="wrap">
              <div id="info">
                <div id="logo"><img src={data.images.logo} alt="" /></div>
                <div id="infoContent">
                  <h1>{data.name}</h1>
                  <div id="cat">{data.category.name}</div>
                  <div id="qrcode">
                    <QRCode value={data.website.url} renderAs="svg"/>
                  </div>
                </div>
              </div>
              <div id="content">
                <div id="intro" className="contentItem h5">
                  <div className="title">{globalData && globalData.introduction}</div>
                  <div dangerouslySetInnerHTML={{__html:data.details.introduction}} />
                  <div id="tags">
                    {data.details.tags.map((value, idx)=>{
                      return(
                        <span key={idx}>{idx > 0 && ', '}{value}</span>
                      )
                    })}
                  </div>
                </div>
                <div id="awards" className="contentItem h5">
                  <div className="title">{globalData && globalData.awards}</div>
                  <ul>
                  {
                    data.details.awards.map((value, idx)=>{
                      return(
                        <li key={idx}>
                          <div className="year">{value.year}</div>
                          <div className="awradsTitle">{value.name}</div>
                          <div className="awradsResult">{value.result}</div>
                        </li>
                      )
                    })
                  }
                  </ul>
                </div>
                <div id="showcase" className="contentItem h6">
                  <div className="title h5">{globalData && globalData.showcase}</div>
                  <ul>
                  {
                    data.details.showcase.map((value, idx)=>{
                      return(
                        <li key={idx} className={value.type}>
                          {
                            value.src && 
                            <>
                            {value.type === 'image' && <img src={value.src} alt="" /> }
                            {value.type === 'video' && <video muted controls><source src={value.src} type="video/mp4"></source></video> }
                            {value.description && <div dangerouslySetInnerHTML={{__html:value.description}} />}
                            </>
                          }
                        </li>
                      )
                    })
                  }
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
    data: state.data ? state.data[state.lang] : null,
    imageClickedIdx: state.imageClickedIdx,
  };
};

export default connect(mapStateToProps)(ProjectSingle);
