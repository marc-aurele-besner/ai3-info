import { FC } from "react";
import { FaGithub, FaHeart, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";

export const Footer: FC = () => {
  return (
    <footer className="site-footer" aria-label="Footer" role="contentinfo">
      <p className="footer-brand">AI3 Info</p>
      <a
        href="https://github.com/marc-aurele-besner/ai3-info"
        target="_blank"
        rel="noopener noreferrer"
        className="text-link"
        aria-label="Open project GitHub repository in a new tab"
      >
        <FaGithub aria-hidden="true" />
        GitHub repo
        <FiArrowUpRight aria-hidden="true" />
      </a>
      <p className="footer-credit">
        Made with <FaHeart className="footer-heart" aria-label="love" /> by
        Marc-Aurèle
      </p>
      <div className="footer-social" aria-label="Social links">
        <a
          href="https://github.com/marc-aurele-besner"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Marc-Aurèle on GitHub"
        >
          <FaGithub size={16} aria-hidden="true" />
        </a>
        <a
          href="https://www.linkedin.com/in/marc-aurele-besner/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Marc-Aurèle on LinkedIn"
        >
          <FaLinkedin size={16} aria-hidden="true" />
        </a>
        <a
          href="https://x.com/marcaureleb"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Marc-Aurèle on X (Twitter)"
        >
          <FaXTwitter size={16} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
};
