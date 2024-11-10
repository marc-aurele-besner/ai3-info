import { FC } from "react";
import { FaGithub, FaHeart, FaLinkedin, FaTwitter } from "react-icons/fa";

export const Footer: FC = () => {
  return (
    <footer className="flex flex-wrap justify-center items-center bg-gray-900 text-white py-4 w-full mt-auto">
      <a
        href="https://github.com/marc-aurele-besner/ai3-info"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 mr-8"
      >
        <FaGithub size={24} />
        <span>GitHub Repo</span>
      </a>
      <p className="flex items-center gap-2 md:mr-8">
        Made with <FaHeart className="text-red-500" /> by Marc-Aurèle
      </p>
      <div className="flex gap-4 mt-4 md:mt-0">
        <a
          href="https://github.com/marc-aurele-besner"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub className="text-white hover:text-gray-400" size={24} />
        </a>
        <a
          href="https://www.linkedin.com/in/marc-aurele-besner/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin className="text-white hover:text-gray-400" size={24} />
        </a>
        <a
          href="https://x.com/marcaureleb"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTwitter className="text-white hover:text-gray-400" size={24} />
        </a>
      </div>
    </footer>
  );
};
