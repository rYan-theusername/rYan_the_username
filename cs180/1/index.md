---
layout: default
title: Project 1
---

# Project 1
## Colorizing the Russian Empire

You should watch the colorized World War 1 film _They Shall Not Grow Old_. It opens in black and white but bursts dramatically into color as the soldiers enter the trenches. ___Color is supremely powerful. It breathes life into our pictures.___ 

Yet, as much as I love _They Shall Not Grow Old_, the colorization is not _real_; there is no _true_ color dimension in the original pictures, so the filmmakers are doing little more than coloring in a coloring book. I admit this is a perhaps unfair comparison: one can make _some_ reasonable inference from the one dimensional black and white image with prior knowledge of what the world looks like. Hence, their interpretation is without-a-doubt much prettier and more believable than one thought up by a toddler with a couple of crayons.

For more than 100 years, black and white was the best we had; color photography did not become accessible or reliable until the invention of Kodachrome in the 1930s. I'd bet that people were _itching_ to record the world as they _truly_ see it. James Clerk Maxwell is credited with being the first to scratch that itch. Here's his idea:

<figure class="quote">
<blockquote>
<p>Let a plate of red glass be placed before the camera, and an impression taken. The positive of this will be transparent wherever the red light has been abundant in the landscape, and opaque where it has been wanting. Let it now be put in a magic lantern, along with the red glass, and a red picture will be thrown on the screen.</p>
<p>Let this operation be repeated with a green and a violet glass, and, by means of three magic lanterns, let the three images be superimposed on the screen. The colour of any point on the screen will then depend on that of the corresponding point of the landscape; and, by properly adjusting the intensities of the lights, &amp;c., a complete copy of the landscape, as far as visible colour is concerned, will be thrown on the screen. The only apparent difference will be, that the copy will be more subdued, or less pure in tint, than the original. Here, however, we have the process performed twice&mdash;first on the screen, and then on the retina.</p>
</blockquote>
<figcaption>James Clerk Maxwell, <cite>Experiments on Colour</cite> (1855)</figcaption>
</figure>

In summary, he wanted to record _three_ images instead of one, in a sense emulating the _three_ photoreceptive "cones" in our eyes sensitive to short, medium, and long wavelengths of light. In 1861 Maxwell recruited Thomas Sutton, a pioneering photographer and inventor, to demonstrate the technique. On the 17th of May, Sutton took three black and white transparencies of a tartan ribbon through red, green, and blue filters:

<figure class="carousel" data-carousel tabindex="0" aria-roledescription="carousel" aria-label="Thomas Sutton's three lantern slides - The Tartan Ribbon">
  <div class="carousel-viewport">
    <ul class="carousel-track">
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/sutton_red.png' | relative_url }}" alt="Sutton's red-filter lantern slide of a tartan ribbon, in a wooden frame">
        <p class="carousel-caption">Red filter</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/sutton_green.png' | relative_url }}" alt="Sutton's green-filter lantern slide of a tartan ribbon, in a wooden frame">
        <p class="carousel-caption">Green filter</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/sutton_blue.png' | relative_url }}" alt="Sutton's blue-violet-filter lantern slide of a tartan ribbon, in a wooden frame">
        <p class="carousel-caption">Blue-violet filter</p>
      </li>
    </ul>
  </div>
  <div class="carousel-controls">
    <button type="button" class="carousel-btn" data-carousel-prev aria-label="Previous slide">Prev</button>
    <div class="carousel-dots" role="tablist" aria-label="Slides">
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show red filter slide" aria-current="true"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show green filter slide"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show blue-violet filter slide"></button>
    </div>
    <button type="button" class="carousel-btn" data-carousel-next aria-label="Next slide">Next</button>
  </div>
  <figcaption>Thomas Sutton’s lantern slides of a tartan ribbon, 1861</figcaption>
</figure>

_Sutton's_ images provide us a full _three_ dimensions of information to colorize the picture. The result is in some respects more "true" than the artistic interpretation of black and white pictures in _They Shall Not Grow Old_. Here is what happens when we crop, stack up, and tint the three images appropriately:

<div class="image-row">
  <figure>
    <img src="{{ '/cs180/1/images/unaligned_sutton.jpg' | relative_url }}" alt="Unaligned overlay of Sutton's red, green, and blue lantern slides">
    <figcaption>Unaligned</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/1/images/aligned_simple_ssim_useangle=true_sutton.jpg' | relative_url }}" alt="Aligned overlay of Sutton's red, green, and blue lantern slides">
    <figcaption>Aligned</figcaption>
  </figure>
</div>

We should also line up the transparencies appropriately; the alignment above was done by python scripts I wrote. The results are of course limited, by the fact that I am reconstructing with unideal _pictures_ of _transparent plates_ created $150+$ years ago. Anyway, we might get a better result by lining up the three images and illuminating them by, in the words of Maxwell, a "magic lantern."

<figure>
  <img src="{{ '/cs180/1/images/sutton_color.png' | relative_url }}" alt="The three Sutton transparencies manually aligned and projected in color">
  <figcaption>Manually aligned plates · <a href="https://www.mdpi.com/2571-9408/6/2/54">Source</a></figcaption>
</figure>

This looks quite similar to the one created by my scripts! It still looks pretty bad though, so for the rest of the project I'll align some higher quality black and white images taken by [Sergey Prokudin-Gorsky](https://en.wikipedia.org/wiki/Sergey_Prokudin-Gorsky). He captured thousands of triplets of red, green, and blue filtered negatives in the early 20th century. You can find them online ([LOC](https://www.loc.gov/exhibits/empire/making.html)).

So, how does it work?

We start with the three black and white negatives corresponding to the red, green, and blue components:

<figure>
  <img src="{{ '/cs180/1/images/blue_green_red.png' | relative_url }}" alt="Blue, green, and red filter plates of a cathedral">
  <figcaption>Blue, green, and red</figcaption>
</figure>

If we naively stack these, the resulting image looks _terrible_. This is because Prokudin-Gorsky didn't take all three pictures in exactly the same location or at exactly the same time. Intuitively, we should to translate, say, the green and red channels so as to line them up with the blue channel:

<div class="image-row">
  <figure>
    <img src="{{ '/cs180/1/images/unaligned_cathedral.jpg' | relative_url }}" alt="Unaligned red, green, and blue cathedral channels stacked as a color image">
    <figcaption>Unaligned</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/1/images/aligned_simple_l2_cathedral.jpg' | relative_url }}" alt="Cathedral after shifting the red and green channels into alignment with blue">
    <figcaption>Aligned</figcaption>
  </figure>
</div>

___Our goal is to determine the shifts $\Delta x, \Delta y$ that result in the "best image."___

But how do we algorithmically compare the "similarity" of two color channels? The most straightforward approach is the $\ell^2$ norm. To compare the B and R channels you'd compute $\lVert \mathbf{y}_B - \mathbf{y}_R \rVert_2$. This in essence answers the question "how big, on a pixel by pixel basis, is the difference between blue and red?" To align B and R, we'll jitter around the red image (testing, say, all $400$ displacements within $\pm 10$ pixels of the unaligned default); record the difference according to the $\ell^2$ norm at each; and then pick the best one.

The animation below demonstrates this process.

![Animation demonstrating channel alignment process]({{ '/cs180/1/images/monastery-split-align.gif' | relative_url }})

Here are the results of running this exact process on three small images:

## Simple L2

<figure class="carousel" data-carousel tabindex="0" aria-roledescription="carousel" aria-label="Simple L2 alignments">
  <div class="carousel-viewport">
    <ul class="carousel-track">
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_simple_l2_cathedral.jpg' | relative_url }}" alt="cathedral: red shift (3, 12), green shift (2, 5)">
        <p class="carousel-caption">cathedral</p>
        <p class="carousel-stats">R (3, 12) · G (2, 5)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_simple_l2_monastery.jpg' | relative_url }}" alt="monastery: red shift (2, 3), green shift (2, -3)">
        <p class="carousel-caption">monastery</p>
        <p class="carousel-stats">R (2, 3) · G (2, -3)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_simple_l2_tobolsk.jpg' | relative_url }}" alt="tobolsk: red shift (3, 6), green shift (3, 3)">
        <p class="carousel-caption">tobolsk</p>
        <p class="carousel-stats">R (3, 6) · G (3, 3)</p>
      </li>
    </ul>
  </div>
  <div class="carousel-controls">
    <button type="button" class="carousel-btn" data-carousel-prev aria-label="Previous slide">Prev</button>
    <div class="carousel-dots" role="tablist" aria-label="Slides">
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show cathedral" aria-current="true"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show monastery"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show tobolsk"></button>
    </div>
    <button type="button" class="carousel-btn" data-carousel-next aria-label="Next slide">Next</button>
  </div>
</figure>

This approach clearly works quite well! The problem is that it does not scale well with bigger shifts or larger pictures. Trying to align some of the higher quality images in the dataset would take _way too long_!

Consider the case where we have to test shifts by up to $100$ pixels; we would have to test $200 \times 200 = 40000$ shifts instead of $400$. Further, the computation of $\ell^2$ norm scales quadratically with the image size; what takes, say, 100 seconds on a $10 \times 10$ image instead takes $10000$ seconds on a $100 \times 100$ image.

The solution is to solve a _simpler problem_. In particular, we are going to downsample so as to reduce the size of the image we have to align. After aligning the smaller image, we can upsample, and then refine our previous "best guess." This exact process can be repeated recursively to make the initial downsampled image arbitrarily small.

The nice thing is that the refinements we make as the recursion unwinds are _super easy_. Why? Consider a tiny $2 \times 2$ pixel patch. After downsampling, these collapse to a single pixel. This means that in theory the furthest "off" our estimate can be is a _single pixel_!

Of course we cannot downsample by naively throwing away every other pixel due to [aliasing](https://www.youtube.com/watch?v=xUzhKqf22mY). Since the anti-aliasing filter we apply spreads the a pixel's brightness beyond a narrow $\pm 1$ pixel window, we should really try a slightly more broad search window (perhaps $\pm 3$) than that.

This approach is explained by the animation below. Notice that the estimated shift computed on a downsampled image looks quite good, even before we apply any refinements.

![Animation demonstrating multiscale alignment technique]({{ '/cs180/1/images/emir_pyramid.gif' | relative_url }})

This strategy is called a "multiscale" or "image pyramid" processing technique. Below are the results computed with this approach on some example images.

## Multiscale L2

<figure class="carousel" data-carousel tabindex="0" aria-roledescription="carousel" aria-label="Multiscale L2 alignments">
  <div class="carousel-viewport">
    <ul class="carousel-track">
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_l2_cathedral.jpg' | relative_url }}" alt="cathedral: red shift (3, 12), green shift (2, 5)">
        <p class="carousel-caption">cathedral</p>
        <p class="carousel-stats">R (3, 12) · G (2, 5)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_l2_church.jpg' | relative_url }}" alt="church: red shift (214, 63), green shift (4, 25)">
        <p class="carousel-caption">church</p>
        <p class="carousel-stats">R (214, 63) · G (4, 25)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_l2_emir.jpg' | relative_url }}" alt="emir: red shift (57, 103), green shift (24, 49)">
        <p class="carousel-caption">emir</p>
        <p class="carousel-stats">R (57, 103) · G (24, 49)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_l2_harvesters.jpg' | relative_url }}" alt="harvesters: red shift (13, 124), green shift (16, 59)">
        <p class="carousel-caption">harvesters</p>
        <p class="carousel-stats">R (13, 124) · G (16, 59)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_l2_icon.jpg' | relative_url }}" alt="icon: red shift (23, 90), green shift (17, 41)">
        <p class="carousel-caption">icon</p>
        <p class="carousel-stats">R (23, 90) · G (17, 41)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_l2_ilemselga.jpg' | relative_url }}" alt="ilemselga: red shift (11, 130), green shift (7, 39)">
        <p class="carousel-caption">ilemselga</p>
        <p class="carousel-stats">R (11, 130) · G (7, 39)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_l2_melons.jpg' | relative_url }}" alt="melons: red shift (13, 178), green shift (11, 82)">
        <p class="carousel-caption">melons</p>
        <p class="carousel-stats">R (13, 178) · G (11, 82)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_l2_monastery.jpg' | relative_url }}" alt="monastery: red shift (2, 3), green shift (2, -3)">
        <p class="carousel-caption">monastery</p>
        <p class="carousel-stats">R (2, 3) · G (2, -3)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_l2_religous_painting.jpg' | relative_url }}" alt="religous painting: red shift (7, 68), green shift (3, 28)">
        <p class="carousel-caption">religous painting</p>
        <p class="carousel-stats">R (7, 68) · G (3, 28)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_l2_self_portrait.jpg' | relative_url }}" alt="self portrait: red shift (36, 176), green shift (29, 79)">
        <p class="carousel-caption">self portrait</p>
        <p class="carousel-stats">R (36, 176) · G (29, 79)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_l2_siren.jpg' | relative_url }}" alt="siren: red shift (-25, 96), green shift (-6, 49)">
        <p class="carousel-caption">siren</p>
        <p class="carousel-stats">R (-25, 96) · G (-6, 49)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_l2_three_generations.jpg' | relative_url }}" alt="three generations: red shift (11, 112), green shift (14, 53)">
        <p class="carousel-caption">three generations</p>
        <p class="carousel-stats">R (11, 112) · G (14, 53)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_l2_tobolsk.jpg' | relative_url }}" alt="tobolsk: red shift (3, 6), green shift (3, 3)">
        <p class="carousel-caption">tobolsk</p>
        <p class="carousel-stats">R (3, 6) · G (3, 3)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_l2_wharf.jpg' | relative_url }}" alt="wharf: red shift (-16, 83), green shift (-7, 15)">
        <p class="carousel-caption">wharf</p>
        <p class="carousel-stats">R (-16, 83) · G (-7, 15)</p>
      </li>
    </ul>
  </div>
  <div class="carousel-controls">
    <button type="button" class="carousel-btn" data-carousel-prev aria-label="Previous slide">Prev</button>
    <div class="carousel-dots" role="tablist" aria-label="Slides">
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show cathedral" aria-current="true"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show church"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show emir"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show harvesters"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show icon"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show ilemselga"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show melons"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show monastery"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show religous painting"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show self portrait"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show siren"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show three generations"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show tobolsk"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show wharf"></button>
    </div>
    <button type="button" class="carousel-btn" data-carousel-next aria-label="Next slide">Next</button>
  </div>
</figure>

I want to point out the image "church."" This is clearly _not_ so good! Why? Notice how much brighter the blue channel is, among the negatives pictured below. This makes sense since most of the image is blue (ocean / sky). This uneven spread of brightness means that computing a brightness comparison pixel-by-pixel, as the $\ell^2$ norm does, is ineffective.

<figure>
  <img src="{{ '/cs180/1/images/church_negatives.png' | relative_url }}" alt="Blue, green, and red filter plates of a church">
  <figcaption>Blue, green, and red negatives of "church"</figcaption>
</figure>

If you look very closely, you'll also notice that "emir" is not well aligned for a similar reason; his blue robe lacks brightness in the red and green channels. In this case, however, there is enough similarity in the rest of the image that the algorithm is fairly successful.

We therefore want to try _different score metrics_. This doesn't change the algorithm, but it rewards different types of similarity. The $\ell^2$ norm, since it is high when pixels have dissimilar brightness, simply aligns bright pixels in one color channel with bright pixels in other color channels. This works pretty well, but I am sure you could imagine many situations (aside from "church") where it does not. Consider perhaps a blue pen pictured next to some red pens-- the algorithm might align the blue pen with a red one!

We might instead use _normalized cross correlation_ (NCC), which more accurately compares patterns in images. Imagine representing the two images by vectors (arrows in some ultra-high dimensional space). NCC effectively compares their _directions_ by computing a dot product after de-meaning and normalizing. 

Here's the formula:

$$\dfrac{(\mathbf{y}_B - \bar{y}_B) \cdot (\mathbf{y}_R - \bar{y}_R)}{\|\mathbf{y}_B - \bar{y}_B\|_2 \|\mathbf{y}_R - \bar{y}_R\|_2}$$


And here are the results:

## Multiscale NCC

<figure class="carousel" data-carousel tabindex="0" aria-roledescription="carousel" aria-label="Multiscale NCC alignments">
  <div class="carousel-viewport">
    <ul class="carousel-track">
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ncc_cathedral.jpg' | relative_url }}" alt="cathedral: red shift (3, 12), green shift (2, 5)">
        <p class="carousel-caption">cathedral</p>
        <p class="carousel-stats">R (3, 12) · G (2, 5)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ncc_church.jpg' | relative_url }}" alt="church: red shift (-4, 58), green shift (4, 25)">
        <p class="carousel-caption">church</p>
        <p class="carousel-stats">R (-4, 58) · G (4, 25)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ncc_emir.jpg' | relative_url }}" alt="emir: red shift (-198, 141), green shift (24, 49)">
        <p class="carousel-caption">emir</p>
        <p class="carousel-stats">R (-198, 141) · G (24, 49)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ncc_harvesters.jpg' | relative_url }}" alt="harvesters: red shift (14, 124), green shift (17, 60)">
        <p class="carousel-caption">harvesters</p>
        <p class="carousel-stats">R (14, 124) · G (17, 60)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ncc_icon.jpg' | relative_url }}" alt="icon: red shift (23, 89), green shift (17, 41)">
        <p class="carousel-caption">icon</p>
        <p class="carousel-stats">R (23, 89) · G (17, 41)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ncc_ilemselga.jpg' | relative_url }}" alt="ilemselga: red shift (11, 130), green shift (7, 40)">
        <p class="carousel-caption">ilemselga</p>
        <p class="carousel-stats">R (11, 130) · G (7, 40)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ncc_melons.jpg' | relative_url }}" alt="melons: red shift (13, 178), green shift (11, 82)">
        <p class="carousel-caption">melons</p>
        <p class="carousel-stats">R (13, 178) · G (11, 82)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ncc_monastery.jpg' | relative_url }}" alt="monastery: red shift (2, 3), green shift (2, -3)">
        <p class="carousel-caption">monastery</p>
        <p class="carousel-stats">R (2, 3) · G (2, -3)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ncc_religous_painting.jpg' | relative_url }}" alt="religous painting: red shift (7, 68), green shift (3, 28)">
        <p class="carousel-caption">religous painting</p>
        <p class="carousel-stats">R (7, 68) · G (3, 28)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ncc_self_portrait.jpg' | relative_url }}" alt="self portrait: red shift (36, 176), green shift (29, 79)">
        <p class="carousel-caption">self portrait</p>
        <p class="carousel-stats">R (36, 176) · G (29, 79)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ncc_siren.jpg' | relative_url }}" alt="siren: red shift (-25, 96), green shift (-6, 49)">
        <p class="carousel-caption">siren</p>
        <p class="carousel-stats">R (-25, 96) · G (-6, 49)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ncc_three_generations.jpg' | relative_url }}" alt="three generations: red shift (11, 112), green shift (14, 53)">
        <p class="carousel-caption">three generations</p>
        <p class="carousel-stats">R (11, 112) · G (14, 53)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ncc_tobolsk.jpg' | relative_url }}" alt="tobolsk: red shift (3, 6), green shift (3, 3)">
        <p class="carousel-caption">tobolsk</p>
        <p class="carousel-stats">R (3, 6) · G (3, 3)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ncc_wharf.jpg' | relative_url }}" alt="wharf: red shift (-16, 83), green shift (-7, 15)">
        <p class="carousel-caption">wharf</p>
        <p class="carousel-stats">R (-16, 83) · G (-7, 15)</p>
      </li>
    </ul>
  </div>
  <div class="carousel-controls">
    <button type="button" class="carousel-btn" data-carousel-prev aria-label="Previous slide">Prev</button>
    <div class="carousel-dots" role="tablist" aria-label="Slides">
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show cathedral" aria-current="true"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show church"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show emir"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show harvesters"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show icon"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show ilemselga"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show melons"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show monastery"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show religous painting"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show self portrait"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show siren"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show three generations"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show tobolsk"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show wharf"></button>
    </div>
    <button type="button" class="carousel-btn" data-carousel-next aria-label="Next slide">Next</button>
  </div>
</figure>

Notice that "church" is fixed but "emir" is _worse_! Why?

The dot product computed by NCC compares image _directions_ and so it rewards similar _textures_ and _patterns_. As we can see in the negatives, the robe's patterns differ significantly in B, G, and R. Hence, NCC struggles.

<figure>
  <img src="{{ '/cs180/1/images/emir_negatives.png' | relative_url }}" alt="Blue, green, and red filter plates of a man in a robe">
  <figcaption>Blue, green, and red negatives of "emir"</figcaption>
</figure>

One final metric I tried is the _structural similarity index measure_ ([SSIM](https://en.wikipedia.org/wiki/Structural_similarity_index_measure)). This was developed in the early 2000s to accurately predict the similarity of images as a _human_ would perceive them. It considers three components: luminance(l), contrast(c), and structure(s). 

The $\ell^2$ norm already effectively compares (l) and (c), which measure the pixels' mean intensity and variance respectively, by comparing brightness. NCC _strips away_ (l) and (c) by de-meaning and normalizing to compare on (s). SSIM, in a sense, is our "goldilocks!" Verify for yourself that the results are good.


## Multiscale SSIM

<figure class="carousel" data-carousel tabindex="0" aria-roledescription="carousel" aria-label="Multiscale SSIM alignments">
  <div class="carousel-viewport">
    <ul class="carousel-track">
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ssim_cathedral.jpg' | relative_url }}" alt="cathedral: red shift (3, 12), green shift (2, 5)">
        <p class="carousel-caption">cathedral</p>
        <p class="carousel-stats">R (3, 12) · G (2, 5)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ssim_church.jpg' | relative_url }}" alt="church: red shift (-4, 58), green shift (4, 25)">
        <p class="carousel-caption">church</p>
        <p class="carousel-stats">R (-4, 58) · G (4, 25)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ssim_emir.jpg' | relative_url }}" alt="emir: red shift (40, 105), green shift (23, 50)">
        <p class="carousel-caption">emir</p>
        <p class="carousel-stats">R (40, 105) · G (23, 50)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ssim_harvesters.jpg' | relative_url }}" alt="harvesters: red shift (13, 123), green shift (16, 59)">
        <p class="carousel-caption">harvesters</p>
        <p class="carousel-stats">R (13, 123) · G (16, 59)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ssim_icon.jpg' | relative_url }}" alt="icon: red shift (23, 89), green shift (17, 40)">
        <p class="carousel-caption">icon</p>
        <p class="carousel-stats">R (23, 89) · G (17, 40)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ssim_ilemselga.jpg' | relative_url }}" alt="ilemselga: red shift (11, 130), green shift (7, 39)">
        <p class="carousel-caption">ilemselga</p>
        <p class="carousel-stats">R (11, 130) · G (7, 39)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ssim_melons.jpg' | relative_url }}" alt="melons: red shift (13, 177), green shift (10, 80)">
        <p class="carousel-caption">melons</p>
        <p class="carousel-stats">R (13, 177) · G (10, 80)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ssim_monastery.jpg' | relative_url }}" alt="monastery: red shift (2, 3), green shift (2, -3)">
        <p class="carousel-caption">monastery</p>
        <p class="carousel-stats">R (2, 3) · G (2, -3)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ssim_religous_painting.jpg' | relative_url }}" alt="religous painting: red shift (7, 69), green shift (3, 29)">
        <p class="carousel-caption">religous painting</p>
        <p class="carousel-stats">R (7, 69) · G (3, 29)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ssim_self_portrait.jpg' | relative_url }}" alt="self portrait: red shift (37, 175), green shift (29, 78)">
        <p class="carousel-caption">self portrait</p>
        <p class="carousel-stats">R (37, 175) · G (29, 78)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ssim_siren.jpg' | relative_url }}" alt="siren: red shift (-24, 96), green shift (-6, 49)">
        <p class="carousel-caption">siren</p>
        <p class="carousel-stats">R (-24, 96) · G (-6, 49)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ssim_three_generations.jpg' | relative_url }}" alt="three generations: red shift (11, 113), green shift (17, 56)">
        <p class="carousel-caption">three generations</p>
        <p class="carousel-stats">R (11, 113) · G (17, 56)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ssim_tobolsk.jpg' | relative_url }}" alt="tobolsk: red shift (3, 6), green shift (3, 3)">
        <p class="carousel-caption">tobolsk</p>
        <p class="carousel-stats">R (3, 6) · G (3, 3)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ssim_wharf.jpg' | relative_url }}" alt="wharf: red shift (-16, 82), green shift (-7, 15)">
        <p class="carousel-caption">wharf</p>
        <p class="carousel-stats">R (-16, 82) · G (-7, 15)</p>
      </li>
    </ul>
  </div>
  <div class="carousel-controls">
    <button type="button" class="carousel-btn" data-carousel-prev aria-label="Previous slide">Prev</button>
    <div class="carousel-dots" role="tablist" aria-label="Slides">
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show cathedral" aria-current="true"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show church"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show emir"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show harvesters"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show icon"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show ilemselga"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show melons"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show monastery"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show religous painting"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show self portrait"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show siren"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show three generations"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show tobolsk"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show wharf"></button>
    </div>
    <button type="button" class="carousel-btn" data-carousel-next aria-label="Next slide">Next</button>
  </div>
</figure>

Indeed, all the pictures look well aligned! Here are three more images I reconstructed. These were all picked out by my father. I thought this project was pretty cool; and I shared it with him; and he agreed.

## Dad's Choice SSIM

<figure class="carousel" data-carousel tabindex="0" aria-roledescription="carousel" aria-label="Personal SSIM alignments">
  <div class="carousel-viewport">
    <ul class="carousel-track">
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ssim_isfandiyar.jpg' | relative_url }}" alt="isfandiyar: red shift (0, 105), green shift (5, 41)">
        <p class="carousel-caption">isfandiyar</p>
        <p class="carousel-stats">R (0, 105) · G (5, 41)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ssim_cotton.jpg' | relative_url }}" alt="cotton: red shift (34, 131), green shift (24, 67)">
        <p class="carousel-caption">cotton</p>
        <p class="carousel-stats">R (34, 131) · G (24, 67)</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/1/images/aligned_multiscale_ssim_camel.jpg' | relative_url }}" alt="camel: red shift (-21, 96), green shift (-5, 46)">
        <p class="carousel-caption">camel</p>
        <p class="carousel-stats">R (-21, 96) · G (-5, 46)</p>
      </li>
    </ul>
  </div>
  <div class="carousel-controls">
    <button type="button" class="carousel-btn" data-carousel-prev aria-label="Previous slide">Prev</button>
    <div class="carousel-dots" role="tablist" aria-label="Slides">
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show isfandiyar" aria-current="true"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show cotton"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show camel"></button>
    </div>
    <button type="button" class="carousel-btn" data-carousel-next aria-label="Next slide">Next</button>
  </div>
</figure>

One final modifaction I made to the algorithm is to also sweep some different _angles of rotation_. This was necessary to get better alignment of The Tartan Ribbon (mentioned at the beginning). After determining an optimal shift, we can twist that channel a little bit to see if it scores better according to whichever score function we chose. Here is the comparison. 

<div class="image-row">
  <figure>
    <img src="{{ '/cs180/1/images/aligned_simple_ssim_useangle=false_sutton.jpg' | relative_url }}" alt="Sutton's ribbon without an angle adjustment">
    <figcaption>No angle adjustment</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/1/images/aligned_simple_ssim_useangle=true_sutton.jpg' | relative_url }}" alt="Sutton's ribbon with an angle adjustment">
    <figcaption>With angle adjustment</figcaption>
  </figure>
</div>

_If you're having a hard time noticing, look at the tips of the ribbon tie's ears._
