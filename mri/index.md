---
layout: default
title: MRI
description: Deconstructing MRI, a Fall 2026 UC Berkeley DeCal.
---

{% assign course = site.data.mri %}

# {{ course.title }}
<p class="lede">{{ course.subtitle }} · {{ course.term }} {{ course.kind }}</p>

<nav class="skip-btns" aria-label="On this page">
  <a href="#syllabus">Skip to syllabus</a>
  <a href="#schedule">Skip to schedule</a>
</nav>

Hello! This fall, I'm teaching (for the first time ever) a decal about MRI. Why? Magnetic Resonance Imaging is an _incredible_ application of the signals and systems theory I have been studying over the past year. It's fun learning about that stuff for nothing more than "the love of the game," but it's _more_ fun to see how it is applied to do something useful.

Here is a picture of my hand / wrist:

<div class="mri-gif-wrap">
  <img class="mri-gif" src="{{ '/mri/images/top_to_bottom_cartesian.gif' | relative_url }}" alt="MRI reconstruction of a wrist, slice by slice">
</div>

This was spat out by an old MRI wrist scanner which lives in the basement of Cory Hall. Miki is letting me use this for an interactive lab marking the culmination of my decal. Here is what the scanner looks like (beautification, courtesy of our ol' pal Gemini):

<img src="{{ '/mri/images/aspect_scanner.png' | relative_url }}" alt="The 1.5T Aspect wrist scanner in Cory Hall">

I haven't even gotten to the best part, which is teaching the class. It should be a ton of fun! That is: ___for me and for you___, if perchance you are a prospective student :)

I wanted to add to my personal webpage, all the resources to be used in class. Of course, everything is free for all. After all, most of the stuff I "made" is taken from or heavily inspired by others. Special shoutouts go to Miki Lustig (of course) and Peder Larson (from UCSF; his [textbook](https://larsonlab.github.io/MRI-education-resources/Introduction.html) laid the groundwork for my choices in designing this course).

## About
{: #syllabus}

An introduction to MRI for undergraduates with an engineering background. Unlike other imaging methods, the MRI signal comes from the hydrogen atoms in your body. How does it work? Put the patient in a magnetic field, apply a radio frequency, and listen to the hydrogen atoms _sing_.
This field is interdisciplinary. You will learn some physics, math, and biology, and then see how these concepts work together to make MRI possible. The approach to imaging is also broadly applicable, and the intuition you develop will come in handy throughout your engineering career.

We're going to spend most of our time surveying the principles of MRI. I will focus on developing an intuitive and visual understanding of the MR phenomenon, so most of the assignments and class time will be dedicated to demonstrations and simulations. 

I'd like to one day build a low-field scanner with some of my fellow students — inspired by [this hackathon held at NYU]({{ course.hackathon_url }}). My hope is to teach you how MRI works. Maybe, along the way, I'll convince you that MRI is neat and worth the time and struggle that will inevitably come from such a project.

## When and where

<div class="item">
  <div class="item-head">
    <strong>{{ course.when }}</strong>
    <span class="item-when">{{ course.term }}</span>
  </div>
  <div class="item-org">{{ course.where }}</div>
</div>

<div class="item">
  <div class="item-head">
    <strong>Office hours</strong>
  </div>
  <div class="item-org">{{ course.office_hours }}</div>
</div>

<div class="item">
  <div class="item-head">
    <strong>Instructors</strong>
  </div>
  <div class="item-org">
    {% for person in course.instructors %}
    <a href="mailto:{{ person.email }}">{{ person.name }}</a>{% unless forloop.last %} · {% endunless %}
    {% endfor %}
  </div>
</div>

## Course links

<div class="projects">
  {% if course.edstem.url and course.edstem.url != "" %}
  <a class="project-card" href="{{ course.edstem.url }}" target="_blank" rel="noopener">
    <h2>{{ course.edstem.title }}</h2>
    <p>{{ course.edstem.description }}</p>
  </a>
  {% else %}
  <div class="project-card">
    <h2>{{ course.edstem.title }}</h2>
    <p><span class="soon">Coming soon.</span> {{ course.edstem.description }}</p>
  </div>
  {% endif %}

  {% if course.gradescope.url and course.gradescope.url != "" %}
  <a class="project-card" href="{{ course.gradescope.url }}" target="_blank" rel="noopener">
    <h2>{{ course.gradescope.title }}</h2>
    <p>{{ course.gradescope.description }}{% if course.gradescope.code %}: {{ course.gradescope.code }}{% endif %}</p>
  </a>
  {% else %}
  <div class="project-card">
    <h2>{{ course.gradescope.title }}</h2>
    <p>{% if course.gradescope.code %}{{ course.gradescope.description }}: <strong>{{ course.gradescope.code }}</strong>{% else %}<span class="soon">Coming soon.</span> {{ course.gradescope.description }}{% endif %}</p>
  </div>
  {% endif %}
</div>

## Prerequisites

Familiarity with signals and systems. I will review all the math you need to know, but you'll get more from the class coming in with some experience. If you know what a Fourier transform is, you're probably in good shape.

Ability to write and debug Python. The labs are not going to be technically challenging, but you should know your way around a Python notebook. Don't let this stop you from enrolling, though. There's going to be plenty of office hours.

Exposure to elementary physics. You should be comfortable with vectors, and Faraday's Law of Induction should sound familiar. A physics background will give you better intuition for MRI, but it is not required.

EECS 16A / Physics 89 and Physics 7B (or equivalent) is more than sufficient. These are not hard prerequisites, but I think you'll get more from this DeCal if you come in comfortable with those topics.

## What you will learn

Successful students will:

1. Understand the MRI experiment and explain the physics of the MRI signal — polarization, resonance, excitation, and relaxation of protons.
2. Identify the three fundamental hardware components of an MRI scanner and explain why each is necessary. Understand how pulse sequences manipulate the hardware.
3. Describe the image formation process. In particular, explain the position–frequency mapping used in MRI and differentiate between types of MRI contrast.
4. Simulate, manipulate, and analyze MRI data.

## How the course works

**Lecture.** Two 1-hour lectures each week. Attendance is required in the sense that it makes up a small portion of your grade. I hope you come because I work hard to make class time worthwhile, interactive, and fun. There will be a Google Form at the end of each class for credit.

**Quizzes.** One multiple-choice quiz each week. These are a brief conceptual review, so they should take 15–30 minutes. The nth quiz is released after the second lecture of week n, and due before the first lecture of week n + 1. Submit on Gradescope.

**Dry labs.** Seven Python notebook labs, each about 6 hours. These apply what we learn in class to real or simulated data. I'll release each as soon as we've covered enough relevant material, and you'll have at least two weeks to finish.

**Wet lab.** One 6-hour wet lab during the semester — up to three hours in the lab, plus a pre-lab and a post-lab reflection. This is required to pass, so there will be flexibility in scheduling. We'll meet in small groups to program the 1.5T Aspect scanner in Cory Hall. You'll leave with a picture of your wrist.

**Final presentation.** A very short presentation during the last week. Details TBD. You'll do a little more research on something we learned in class and share it with everyone else.

## Grading

The class is P/NP. Earning at least 70% is a passing grade. Extra credit at my discretion.

- 12% attendance
- 12% weekly quizzes
- 35% dry programming labs
- 31% wet lab
- 10% final presentation

## Policies

**Attendance.** Showing up is valuable, so attendance is mandatory. Keep in mind that it is only a small portion of the grade.

**Late work.** Extensions will be granted with no penalty if you ask before the due date. I'll push the deadline for assignment n to align with assignment n + 1 upon request. Otherwise, no late assignments will be accepted.

The schedule is, of course, tentative and subject to change.

## Schedule

{% for week in course.weeks %}
<div class="week">
  <div class="item-head">
    <strong>Week {{ week.number }} · {{ week.title }}</strong>
    <span class="item-when">{{ week.dates }}</span>
  </div>
  {% if week.topics %}
  <ul class="week-topics">
    {% for topic in week.topics %}
    <li>{{ topic }}</li>
    {% endfor %}
  </ul>
  {% endif %}
  <p class="week-line">
    <span class="week-label">Resources</span>
    {% if week.resources and week.resources.size > 0 %}
      {% for resource in week.resources %}
        {% if resource.url and resource.url != "" %}<a href="{{ resource.url }}" target="_blank" rel="noopener">{{ resource.title }}</a>{% else %}{{ resource.title }}{% endif %}{% unless forloop.last %} · {% endunless %}
      {% endfor %}
    {% else %}
      <span class="soon">Coming soon</span>
    {% endif %}
  </p>
</div>
{% endfor %}

## Labs

Seven dry labs and one wet lab. I'll post each here when it's released. Submit on Gradescope.

<ul class="lab-list">
  {% for lab in course.labs %}
  <li>
    {% if lab.url and lab.url != "" %}
    <a href="{{ lab.url }}" target="_blank" rel="noopener">{{ lab.title }}</a>
    {% else %}
    <span>{{ lab.title }}</span>
    <span class="soon">Coming soon</span>
    {% endif %}
    {% if lab.note %}
    <p class="excerpt">{{ lab.note }}</p>
    {% endif %}
  </li>
  {% endfor %}
</ul>
