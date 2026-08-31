---
layout: default
title: Reviews
---

# Book reviews

Notes on books I have read cover to cover.

{% assign reviews = site.reviews | sort: "date" | reverse %}
{% if reviews.size > 0 %}
<ul class="list">
  {% for review in reviews %}
  <li>
    <a href="{{ review.url | relative_url }}">{{ review.title }}</a>
    <span class="meta">{{ review.book_author }} · {{ review.date | date: "%B %Y" }}</span>
    <p class="excerpt">{{ review.excerpt | strip_html | truncatewords: 45 }}</p>
  </li>
  {% endfor %}
</ul>
{% else %}
<p class="empty">No reviews yet. Add a Markdown file in <code>_reviews/</code>.</p>
{% endif %}
