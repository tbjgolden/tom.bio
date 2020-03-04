import React from "react";
import Jumbotron from "../../Jumbotron";
import Gallery, {
  GalleryItem,
  GalleryRow,
  GalleryText,
  GalleryImage
} from "../../Gallery";
import "./index.scss";

const Portfolio = () => (
  <div className="Portfolio">
    <Jumbotron>
      <div
        className="App-row white-text Portfolio-jumbotron"
        style={{
          background:
            "radial-gradient(circle at 100% 100%, rgb(232, 17, 35), rgb(247, 148, 29) 14%, rgba(255, 242, 0, 1) 28%, rgba(255, 255, 0, 1) 34%, rgb(0, 166, 80) 68%, rgb(0, 84, 165) 80%, rgb(103, 45, 147))"
        }}
      >
        <div className="App-row-sizer">
          <div className="App-row-title">Portfolio</div>
        </div>
      </div>
    </Jumbotron>
    <Gallery>
      <GalleryItem>
        <GalleryText>
          <div className="Gallery-title">shop.shipt.com</div>
          <div className="Gallery-description">
            Built the Shipt mobile and web apps.
          </div>
        </GalleryText>
        <GalleryImage src="images/portfolio/shop.shipt.com.png" />
      </GalleryItem>
      <GalleryRow>
        <GalleryItem>
          <GalleryText>
            <div className="Gallery-title">willtheygo.com</div>
            <div className="Gallery-description">
              Analytical-engine predicting big football transfers.
            </div>
          </GalleryText>
          <GalleryImage src="images/portfolio/willtheygo.com.png" />
        </GalleryItem>
        <GalleryItem>
          <GalleryText>
            <div className="Gallery-title">prevent.rip</div>
            <div className="Gallery-description">
              An interactive infographic to encourage good giving.
            </div>
          </GalleryText>
          <GalleryImage src="images/portfolio/prevent.rip.png" />
        </GalleryItem>
      </GalleryRow>
      <GalleryRow>
        <GalleryItem>
          <GalleryText>
            <div className="Gallery-title">theboar.org</div>
            <div className="Gallery-description">
              Award-winning website for student newspaper.
            </div>
          </GalleryText>
          <GalleryImage src="images/portfolio/theboar.org.png" />
        </GalleryItem>
        <GalleryItem>
          <GalleryText>
            <div className="Gallery-title">codingcatalyst.com</div>
            <div className="Gallery-description">
              Made the website for a coding bootcamp.
            </div>
          </GalleryText>
          <GalleryImage src="images/portfolio/codingcatalyst.com.png" />
        </GalleryItem>
      </GalleryRow>
      <GalleryRow>
        <GalleryItem>
          <GalleryText>
            <div className="Gallery-title">live.gobiapp.com</div>
            <div className="Gallery-description">
              Gobi{"’"}s live streaming feed of snaps.
            </div>
          </GalleryText>
          <GalleryImage src="images/portfolio/live.gobiapp.com.png" />
        </GalleryItem>
        <GalleryItem>
          <GalleryText>
            <div className="Gallery-title">tbjgolden.website</div>
            <div className="Gallery-description">
              Landing page for my rapid website service.
            </div>
          </GalleryText>
          <GalleryImage src="images/portfolio/tbjgolden.website.png" />
        </GalleryItem>
      </GalleryRow>
    </Gallery>
  </div>
);

export default Portfolio;
