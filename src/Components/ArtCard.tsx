import { card } from '../Constant';
import heart from '../assets/images/heart.svg';
import arrow from '../assets/images/arrow.svg';
import { ListIcon } from './Icons';

const ArtCard = () => {
  return (
    <div className="main-container mt-4">
      {card.map(({ img, name, artist }) => (
        <div className="max-w-fit mx-auto bg-black rounded-3xl relative">
          <div className="absolute right-3 top-3 bg-white w-7 h-7 flex justify-center items-center rounded-full">
            <ListIcon />
          </div>
          <img src={img} alt={name} />
          <div className="p-4 ">
            <div className=" flex justify-between">
              <h6 className="heading-6 text-white">{name}</h6>
              <div className="flex space-x-5 text-white">
                <div className="flex space-x-1.5">
                  <p className="font-light text-xs">124</p>
                  <img className="w-4 h-4" src={heart} alt="heart" />
                </div>
                <div className="flex space-x-1.5">
                  <p className="font-light text-xs">33</p>
                  <img className="w-4 h-4" src={arrow} alt="arrows" />
                </div>
              </div>
            </div>

            <p className="paragraph-3 text-gray-300 pt-1.5">{artist}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArtCard;
