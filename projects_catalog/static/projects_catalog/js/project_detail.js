(function () {
  console.log("project_detail.js anonymous initializer");

  class ProjectDomRefs {
    constructor(rootId = "project-page") {
      console.log("project_detail.js ProjectDomRefs.constructor", { rootId });
      this.root = document.getElementById(rootId);
      this.errorBox = document.getElementById("error-box");

      this.crumbTitle = document.getElementById("crumb-title");
      this.projectFullTitle = document.getElementById("project-full-title");
      this.neighborhood = document.getElementById("neighborhood");
      this.startDate = document.getElementById("start-date");
      this.endDate = document.getElementById("end-date");
      this.projectDescriptionSummary = document.getElementById("project-description-summary");

      this.featuredWrap = document.getElementById("featured-wrap");
      this.featuredImg = document.getElementById("featured-img");
      this.projectDescription = document.getElementById("project-description");
      this.projectImpact = document.getElementById("project-impact");
      this.galleryWrap = document.getElementById("gallery-wrap");
      this.gallery = document.getElementById("gallery");

      this.prevNext = document.getElementById("prev-next");
      this.prevSlot = document.getElementById("prev-slot");
      this.nextSlot = document.getElementById("next-slot");

      this.projectLead = document.getElementById("project-lead");
      this.partners = document.getElementById("partners");

      this.projectUrl = document.getElementById("project-url");
      this.productTypes = document.getElementById("product-types");
      this.keywords = document.getElementById("keywords");

      this.productsBlock = document.getElementById("products-block");
      this.productsCallout = document.getElementById("products-callout");
      this.productCardTemplate = document.getElementById("product-card-template");
    }

    get projectCode() {
      console.log("project_detail.js ProjectDomRefs.projectCode");
      return this.root?.dataset?.projectCode || "";
    }

    get apiBase() {
      console.log("project_detail.js ProjectDomRefs.apiBase");
      return (this.root?.dataset?.projectApiBase || "").replace(/\/$/, "");
    }

    get apiToken() {
      console.log("project_detail.js ProjectDomRefs.apiToken");
      return this.root?.dataset?.apiToken || "";
    }
  }

  class BaseRenderer {
    clearChildren(el) {
      console.log("project_detail.js BaseRenderer.clearChildren", { el });
      if (!el) return;
      while (el.firstChild) el.removeChild(el.firstChild);
    }

    setText(el, value) {
      console.log("project_detail.js BaseRenderer.setText", { el, value });
      if (!el) return;
      el.textContent = value === null || value === undefined || value === "" ? "—" : value;
    }
  }

  class ProjectContentRenderer extends BaseRenderer {
    constructor(dom) {
      super();
      console.log("project_detail.js ProjectContentRenderer.constructor", { dom });
      this.dom = dom;
    }

    displayProjectTitle(project) {
      console.log("project_detail.js ProjectContentRenderer.displayProjectTitle", { project });
      return project?.project_full_title || project?.project_name || "Untitled project";
    }

    formatDate(value) {
      console.log("project_detail.js ProjectContentRenderer.formatDate", { value });
      if (!value) return "—";
      const dateValue = new Date(value);
      if (Number.isNaN(dateValue.getTime())) return String(value);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
      }).format(dateValue);
    }

    splitParagraphs(text) {
      console.log("project_detail.js ProjectContentRenderer.splitParagraphs", { text });
      const paragraphs = [];
      if (!text) return paragraphs;

      const parts = String(text).split(/\n\s*\n/);
      for (const part of parts) {
        const cleanedPart = part.trim();
        if (cleanedPart) {
          paragraphs.push(cleanedPart);
        }
      }

      return paragraphs;
    }

    splitBullets(text) {
      console.log("project_detail.js ProjectContentRenderer.splitBullets", { text });
      const bullets = [];
      if (!text) return bullets;

      const lines = String(text).split(/\r?\n/);
      for (const line of lines) {
        const cleanedLine = line.replace(/^\s*[-*]\s*/, "").trim();
        if (cleanedLine) {
          bullets.push(cleanedLine);
        }
      }

      return bullets;
    }

    firstParagraph(text) {
      console.log("project_detail.js ProjectContentRenderer.firstParagraph", { text });
      const paragraphs = this.splitParagraphs(text);
      return paragraphs[0] || "";
    }

    normalizeTags(value) {
      console.log("project_detail.js ProjectContentRenderer.normalizeTags", { value });
      const tags = [];
      if (Array.isArray(value)) {
        for (const item of value) {
          const tag = String(item || "").trim();
          if (tag) {
            tags.push(tag);
          }
        }
        return tags;
      }

      if (typeof value === "string") {
        const parts = value.split(",");
        for (const part of parts) {
          const tag = part.trim();
          if (tag) {
            tags.push(tag);
          }
        }
      }

      return tags;
    }

    productTypeNames(hostingLocations) {
      console.log(
        "project_detail.js ProjectContentRenderer.productTypeNames",
        { hostingLocations },
      );
      const names = [];
      if (!Array.isArray(hostingLocations)) {
        return names;
      }

      for (const location of hostingLocations) {
        const productTypes = Array.isArray(location?.product_types) ? location.product_types : [];
        for (const productType of productTypes) {
          const name = productType?.name;
          if (name && !names.includes(name)) {
            names.push(name);
          }
        }
      }

      names.sort();
      return names;
    }

    projectLeadPeople(project) {
      console.log("project_detail.js ProjectContentRenderer.projectLeadPeople", { project });
      const people = [];
      if (project?.project_lead || project?.project_lead_email) {
        people.push({
          name: project.project_lead || project.project_lead_email,
          email: project.project_lead_email,
        });
      }
      return people;
    }

    partnerPeople(partners) {
      console.log("project_detail.js ProjectContentRenderer.partnerPeople", { partners });
      const people = [];
      if (!Array.isArray(partners)) {
        return people;
      }

      for (const partner of partners) {
        if (partner?.name || partner?.affiliation) {
          people.push({
            name: partner.name,
            organization: partner.affiliation,
          });
        }
      }

      return people;
    }

    renderParagraphs(container, paragraphs) {
      console.log(
        "project_detail.js ProjectContentRenderer.renderParagraphs",
        { container, paragraphs },
      );
      if (!container) return;
      this.clearChildren(container);

      if (!Array.isArray(paragraphs) || paragraphs.length === 0) {
        const p = document.createElement("p");
        p.className = "has-text-grey";
        p.textContent = "No description available.";
        container.appendChild(p);
        return;
      }

      for (const text of paragraphs) {
        const p = document.createElement("p");
        p.textContent = text;
        container.appendChild(p);
      }
    }

    renderBullets(ul, bullets) {
      console.log("project_detail.js ProjectContentRenderer.renderBullets", { ul, bullets });
      if (!ul) return;
      this.clearChildren(ul);

      if (!Array.isArray(bullets) || bullets.length === 0) {
        const li = document.createElement("li");
        li.className = "has-text-grey";
        li.textContent = "No impact statements available.";
        ul.appendChild(li);
        return;
      }

      for (const bullet of bullets) {
        const li = document.createElement("li");
        li.textContent = bullet;
        ul.appendChild(li);
      }
    }

    renderTags(container, items) {
      console.log("project_detail.js ProjectContentRenderer.renderTags", { container, items });
      if (!container) return;
      this.clearChildren(container);

      if (!Array.isArray(items) || items.length === 0) {
        const span = document.createElement("span");
        span.className = "tag is-light";
        span.textContent = "—";
        container.appendChild(span);
        return;
      }

      for (const item of items) {
        const span = document.createElement("span");
        span.className = "tag is-light";
        span.textContent = item;
        container.appendChild(span);
      }
    }

    renderPeopleList(ul, people) {
      console.log("project_detail.js ProjectContentRenderer.renderPeopleList", { ul, people });
      if (!ul) return;
      this.clearChildren(ul);

      if (!Array.isArray(people) || people.length === 0) {
        const li = document.createElement("li");
        li.className = "has-text-grey";
        li.textContent = "—";
        ul.appendChild(li);
        return;
      }

      for (const person of people) {
        const li = document.createElement("li");
        const parts = [];
        if (person.name) parts.push(person.name);
        if (person.organization) parts.push(person.organization);
        if (!parts.length && person.email) parts.push(person.email);

        if (person.email) {
          const a = document.createElement("a");
          a.href = `mailto:${person.email}`;
          a.textContent = parts.join(", ");
          li.appendChild(a);
        } else {
          li.textContent = parts.join(", ");
        }

        ul.appendChild(li);
      }
    }

    renderProjectUrl(container, url) {
      console.log("project_detail.js ProjectContentRenderer.renderProjectUrl", { container, url });
      if (!container) return;
      this.clearChildren(container);

      if (!url) {
        container.classList.add("has-text-grey");
        container.textContent = "—";
        return;
      }

      container.classList.remove("has-text-grey");
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Open project link";
      container.appendChild(link);
    }

    renderFeaturedImage(pictures, projectTitle) {
      console.log(
        "project_detail.js ProjectContentRenderer.renderFeaturedImage",
        { pictures, projectTitle },
      );
      if (!this.dom.featuredWrap || !this.dom.featuredImg) return;

      let featuredPicture = null;
      if (Array.isArray(pictures)) {
        for (const picture of pictures) {
          if (picture?.picture_path) {
            featuredPicture = picture;
            break;
          }
        }
      }

      if (!featuredPicture) {
        this.dom.featuredWrap.hidden = true;
        return;
      }

      this.dom.featuredWrap.hidden = false;
      this.dom.featuredImg.src = featuredPicture.picture_path;
      this.dom.featuredImg.alt = featuredPicture.name || projectTitle || "Project photo";
    }

    renderGallery(pictures, projectTitle) {
      console.log(
        "project_detail.js ProjectContentRenderer.renderGallery",
        { pictures, projectTitle },
      );
      const { galleryWrap, gallery: galleryGrid } = this.dom;
      if (!galleryWrap || !galleryGrid) return;

      this.clearChildren(galleryGrid);

      const galleryPictures = [];
      if (Array.isArray(pictures)) {
        for (const picture of pictures) {
          if (picture?.picture_path) {
            galleryPictures.push(picture);
          }
        }
      }

      if (galleryPictures.length === 0) {
        galleryWrap.hidden = true;
        return;
      }

      galleryWrap.hidden = false;

      for (const picture of galleryPictures) {
        const col = document.createElement("div");
        col.className = "column is-6";

        const card = document.createElement("div");
        card.className = "card gallery-card";

        const cardImage = document.createElement("div");
        cardImage.className = "card-image";

        const figure = document.createElement("figure");
        figure.className = "image is-4by3";

        const image = document.createElement("img");
        image.src = picture.picture_path;
        image.alt = picture.name || projectTitle || "Project photo";

        figure.appendChild(image);
        cardImage.appendChild(figure);

        const cardContent = document.createElement("div");
        cardContent.className = "card-content";

        const caption = document.createElement("p");
        caption.className = "is-size-7 has-text-grey";
        caption.textContent = picture.name || "";

        cardContent.appendChild(caption);

        card.appendChild(cardImage);
        card.appendChild(cardContent);
        col.appendChild(card);

        galleryGrid.appendChild(col);
      }
    }

    renderPrevNext(previousProject, nextProject) {
      console.log(
        "project_detail.js ProjectContentRenderer.renderPrevNext",
        { previousProject, nextProject },
      );
      const { prevNext, prevSlot, nextSlot } = this.dom;
      if (!prevNext || !prevSlot || !nextSlot) return;

      this.clearChildren(prevSlot);
      this.clearChildren(nextSlot);

      if (!previousProject && !nextProject) {
        prevNext.hidden = true;
        return;
      }

      prevNext.hidden = false;

      if (previousProject?.project_detail_url) {
        const a = document.createElement("a");
        a.className = "button is-link is-light";
        a.href = previousProject.project_detail_url;
        a.textContent = `← ${this.displayProjectTitle(previousProject)}`;
        prevSlot.appendChild(a);
      }

      if (nextProject?.project_detail_url) {
        const a = document.createElement("a");
        a.className = "button is-link is-light";
        a.href = nextProject.project_detail_url;
        a.textContent = `${this.displayProjectTitle(nextProject)} →`;
        nextSlot.appendChild(a);
      }
    }

    renderProject(project) {
      console.log("project_detail.js ProjectContentRenderer.renderProject", { project });
      const title = this.displayProjectTitle(project);
      this.setText(this.dom.crumbTitle, title);
      this.setText(this.dom.projectFullTitle, title);

      this.setText(this.dom.neighborhood, project.neighborhood);
      this.setText(this.dom.startDate, this.formatDate(project.start_date));
      this.setText(this.dom.endDate, this.formatDate(project.end_date));
      this.setText(this.dom.projectDescriptionSummary, this.firstParagraph(project.project_description));

      this.renderFeaturedImage(project.pictures, title);
      this.renderParagraphs(this.dom.projectDescription, this.splitParagraphs(project.project_description));
      this.renderBullets(this.dom.projectImpact, this.splitBullets(project.project_impact));
      this.renderGallery(project.pictures, title);

      this.renderPeopleList(this.dom.projectLead, this.projectLeadPeople(project));
      this.renderPeopleList(this.dom.partners, this.partnerPeople(project.partners));

      this.renderProjectUrl(this.dom.projectUrl, project.project_url);
      this.renderTags(this.dom.productTypes, this.productTypeNames(project.hosting_locations));
      this.renderTags(this.dom.keywords, this.normalizeTags(project.keywords));

      this.renderPrevNext(project.previous_project, project.next_project);
    }
  }

  class ProjectApiClient {
    constructor(apiBase, projectCode, apiToken) {
      console.log(
        "project_detail.js ProjectApiClient.constructor",
        { apiBase, projectCode, apiToken },
      );
      this.apiBase = apiBase;
      this.projectCode = projectCode;
      this.apiToken = apiToken || "";
      this.projectUrl = `${this.apiBase}/${encodeURIComponent(this.projectCode)}/`;
      this.productsUrl = `${this.apiBase}/${encodeURIComponent(this.projectCode)}/products/`;
    }

    hasProjectCode() {
      console.log("project_detail.js ProjectApiClient.hasProjectCode");
      return Boolean(this.projectCode);
    }

    jsonHeaders() {
      console.log("project_detail.js ProjectApiClient.jsonHeaders");
      const headers = { Accept: "application/json" };
      if (this.apiToken) {
        headers.Authorization = `Bearer ${this.apiToken}`;
      }
      return headers;
    }

    async fetchJson(url) {
      console.log("project_detail.js ProjectApiClient.fetchJson", { url });
      const response = await fetch(url, { headers: this.jsonHeaders() });
      if (!response.ok) {
        throw new Error(`Request failed (${response.status}) for ${url}`);
      }
      return response.json();
    }

    fetchProject() {
      console.log("project_detail.js ProjectApiClient.fetchProject");
      return this.fetchJson(this.projectUrl);
    }

    fetchProducts() {
      console.log("project_detail.js ProjectApiClient.fetchProducts");
      return this.fetchJson(this.productsUrl);
    }
  }

  class ProjectDetailController {
    constructor({ dom, api, contentRenderer, productsRenderer }) {
      console.log(
        "project_detail.js ProjectDetailController.constructor",
        { dom, api, contentRenderer, productsRenderer },
      );
      this.dom = dom;
      this.api = api;
      this.contentRenderer = contentRenderer;
      this.productsRenderer = productsRenderer;
    }

    showError(message) {
      console.log("project_detail.js ProjectDetailController.showError", { message });
      if (!this.dom.errorBox) return;
      this.dom.errorBox.hidden = false;
      this.dom.errorBox.textContent = message;
    }

    async init() {
      console.log("project_detail.js ProjectDetailController.init");
      if (!this.dom.root) return;

      if (!this.api.hasProjectCode()) {
        this.showError("Missing project code in page context.");
        return;
      }

      try {
        const project = await this.api.fetchProject();
        this.contentRenderer.renderProject(project);

        const products = await this.api.fetchProducts();
        this.productsRenderer.renderProducts(products);
      } catch (err) {
        this.showError(err?.message || "Failed to load project.");
      }
    }
  }

  const dom = new ProjectDomRefs();
  const api = new ProjectApiClient(dom.apiBase, dom.projectCode, dom.apiToken);
  const contentRenderer = new ProjectContentRenderer(dom);
  const ProductCardTemplateModelClass = window.ProductCardTemplateModel;
  const ProjectProductsRendererClass = window.ProjectProductsRenderer;
  if (
    typeof ProductCardTemplateModelClass !== "function"
    || typeof ProjectProductsRendererClass !== "function"
  ) {
    console.error("Project product classes are not loaded.");
    return;
  }
  const productCardTemplateModel = new ProductCardTemplateModelClass();
  const productsRenderer = new ProjectProductsRendererClass(dom, productCardTemplateModel);
  const controller = new ProjectDetailController({ dom, api, contentRenderer, productsRenderer });
  controller.init();
})();
