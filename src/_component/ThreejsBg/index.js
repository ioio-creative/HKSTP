import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";

const ThreejsBg = props => {
  const canvas = useRef(null);

  useEffect(() => {}, []);

  return <canvas ref={canvas} />;
};

const mapStateToProps = state => {
  return { lang: state.lang };
};

export default connect(mapStateToProps)(ThreejsBg);
