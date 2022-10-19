import ART_PREVIEW from "../Assets/Images/artPreview.png";

const ArtPreviewScreen = () => {
  return (
    <div>
      <div className="main-container my-24">
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6 md:col-span-3 ">
            <img className=" object-cover w-full  h-[500px]" src={ART_PREVIEW} alt="Artwork by Nnaemeka Ekwelum" />
          </div>
          <div className="col-span-6 md:col-span-3 mt-5 md:my-10 ">
            <h1 className="heading-3">Archaeology</h1>
            <a className="text-gray-700" href="/">
              @Juliette Hayt Greenberg
            </a>
            <p className="paragraph-1 lg:w-3/4 leading-relaxed pt-5 text-gray-500">
              I was born hungry to understand the human mind and body. My yearnings never stopped. My childhood exploration of life began
              with studying The Atlas of Human Anatomy and Surgery, which evolved into drawing the body both inside and out—my daily ritual.{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtPreviewScreen;
