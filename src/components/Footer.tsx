import { FC } from "react";
import { FaGithub, FaHeart, FaLinkedin, FaTwitter } from "react-icons/fa";

export const Footer: FC = () => {
  return (
    <footer className="flex flex-wrap justify-center items-center bg-gray-900 text-white py-4 w-full mt-auto" aria-label="Footer" role="contentinfo">
      <a
        href="https://github.com/marc-aurele-besner/ai3-info"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 mr-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#576EB2] focus-visible:ring-offset-gray-900 rounded"
        aria-label="Open project GitHub repository in a new tab"
      >
        <FaGithub size={24} aria-hidden="true" />
        <span>GitHub Repo</span>
      </a>
      <p className="flex items-center gap-2 md:mr-8">
        Made with <FaHeart className="text-red-500" aria-label="love" /> by Marc-Aurèle
      </p>
      <div className="flex gap-4 mt-4 md:mt-0" aria-label="Social links">
        <a
          href="https://github.com/marc-aurele-besner"
          target="_blank"
          rel="noopener noreferrer"
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#576EB2] focus-visible:ring-offset-gray-900 rounded"
          aria-label="Visit Marc-Aurèle on GitHub"
        >
          <FaGithub className="text-white hover:text-gray-400" size={24} aria-hidden="true" />
        </a>
        <a
          href="https://www.linkedin.com/in/marc-aurele-besner/"
          target="_blank"
          rel="noopener noreferrer"
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#576EB2] focus-visible:ring-offset-gray-900 rounded"
          aria-label="Visit Marc-Aurèle on LinkedIn"
        >
          <FaLinkedin className="text-white hover:text-gray-400" size={24} aria-hidden="true" />
        </a>
        <a
          href="https://x.com/marcaureleb"
          target="_blank"
          rel="noopener noreferrer"
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#576EB2] focus-visible:ring-offset-gray-900 rounded"
          aria-label="Visit Marc-Aurèle on X (Twitter)"
        >
          <FaTwitter className="text-white hover:text-gray-400" size={24} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
};
