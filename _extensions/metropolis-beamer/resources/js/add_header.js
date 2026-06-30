/**
 * reveal-header
 * A filter that adds header text and logo.
 * 
 * MIT License
 * Copyright (c) 2023-2024 Shafayet Khan Shafee.
 */

function header() {
  
  function is_print_pdf_mode() {
    return /print-pdf/gi.test(window.location.search) ||
      Reveal?.getConfig?.().view === "print";
  };

  function match_print_page_size() {
    const print_page = document.querySelector(".pdf-page");
    if (print_page == null) {
      return false;
    };

    const print_page_rect = print_page.getBoundingClientRect();
    if (print_page_rect.width === 0 || print_page_rect.height === 0) {
      return false;
    };

    let page_style = document.getElementById("metropolis-print-page-size");
    if (page_style == null) {
      page_style = document.createElement("style");
      page_style.id = "metropolis-print-page-size";
      document.head.appendChild(page_style);
    };

    const page_height = Math.max(Math.floor(print_page_rect.height) - 1, 1);
    page_style.textContent =
      `@page { size: ${print_page_rect.width}px ${page_height}px; margin: 0px; }
       html.reveal-print .reveal .slides .pdf-page { height: ${page_height}px !important; }`;
    return true;
  };

  function watch_print_page_size() {
    if (match_print_page_size()) {
      return;
    };

    const slides = document.querySelector(".reveal .slides") || document.body;
    const observer = new MutationObserver(() => {
      if (match_print_page_size()) {
        observer.disconnect();
      };
    });

    observer.observe(slides, { childList: true, subtree: true });
    setTimeout(() => {
      match_print_page_size();
      observer.disconnect();
    }, 1000);
  };

  // add the header structure as the firstChild of div.reveal-header
  function add_header() {
    let header = document.querySelector("div.reveal-header");
    let reveal = document.querySelector(".reveal");
    reveal.insertBefore(header, reveal.firstChild);
    
    let header_title_p_placeholder = document.querySelector('div.header-title > p');
    let header_title_h2_placeholder = document.createElement('h2');
    header_title_p_placeholder.replaceWith(header_title_h2_placeholder);
    
    logo_img = document.querySelector('.header-logo > img');
    if (logo_img?.getAttribute('src') == null) {
      if (logo_img?.getAttribute('data-src') != null) {
        logo_img.src = logo_img?.getAttribute('data-src') || "";
        logo_img.removeAttribute('data-src'); 
      };
    };
  };
  
  
  function make_h2_title() {
    let h2_text = Reveal.getCurrentSlide().getAttribute('data-h2-text');
    let header_title_placeholder = document.querySelector('div.header-title > h2');
    header_title_placeholder.innerText = h2_text;
    
    let header_div = document.querySelector('div.reveal-header');
    
    if(Reveal.getCurrentSlide().id == 'title-slide' ||
       Reveal.getCurrentSlide().classList.contains('title-slide') || h2_text == ''
       ) {
      header_div.style.visibility = 'hidden';
    } else {
      header_div.style.visibility = 'visible';
      header_title_placeholder.style.color = 'white';
    };
  };
  
  
  function linkify_logo(logo, href) {
    const logo_cloned = logo.cloneNode(true);
    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.appendChild(logo_cloned);
    logo.replaceWith(link);
  };
    
  function get_clean_attrs(elem, attrName) {
    let attrVal = elem.getAttribute(attrName);
    if (attrVal != null) {
     elem.removeAttribute(attrName); 
    }
    return attrVal;
  };
  
  
  if (Reveal.isReady()) {
    add_header();
    const is_print_pdf = is_print_pdf_mode();

    if (is_print_pdf) {
      watch_print_page_size();
    };
    
    const slides = Reveal.getSlides();
    slides.forEach(slide => {
      const h2Element = slide.querySelector('h2');
      
      if (h2Element) {
        if (!is_print_pdf) {
          h2Element.style.display = 'none';
        };
        const h2Text = h2Element.textContent;
        slide.setAttribute('data-h2-text', h2Text);
      } else {
        slide.setAttribute('data-h2-text', '');
      };
  });
    
    if (!is_print_pdf) {
      make_h2_title();
    };
    
    /*************** linkifying the header and footer logo ********************/
    const header_logo = document.querySelector('div.header-logo');
    if (header_logo != null) {
      const header_logo_link = get_clean_attrs(header_logo, 'data-header-logo-link');
      const footer_logo_link = get_clean_attrs(header_logo, 'data-footer-logo-link');
      
      if (header_logo_link != null) {
        const header_logo_img = document.querySelector('div.header-logo').firstElementChild;
        linkify_logo(header_logo_img, header_logo_link);
      };
      
    };
    /****************************** END ***************************************/
    
    if (!is_print_pdf) {
      Reveal.on( 'slidechanged', event => {
        make_h2_title();
      });
    };
    
  };
};


window.addEventListener("load", (event) => {
  header();
});
