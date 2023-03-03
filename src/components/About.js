import React from 'react'
import image from "../img/vc.jpg";
const About = () => {

  return (
    <>
      <div className="container" style={{ textAlign: "center" }} ><h2>The page is designed by:</h2></div>
      <div style={{
        backgroundImage: `url(${image})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: 'center',
        backgroundAttachment: "fixed",
        backgroundSize: "contain",

        height: 800, width: 1000
      }}>
      </div>
      <div className="container" style={{ textAlign: "center" }} ><h2>Arup Bhattacharjee</h2></div>

    </>

  )
}

export default About
