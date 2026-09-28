---
layout: default
title: Project 2
---

# Project 2

## Fun with Filters and Frequencies

### Fun with Filters

What is a filter? Google says:

> A filter is a device, material, or program that removes unwanted parts or elements from a substance, signal, or data set while letting the desired parts pass through

In this part of the project I remove "unwanted parts" from images. A natural question is, "what can we easily *remove* from an image?" You could, of course, crop out some parts of the image and call *that* a filter. It is, but it is a *boring one*.

Let's try to extract the *edges* from an image. In order to do this, we must discuss something called "convolution," a word which derives not from "convolute" but "convolve." I think of convolution as a sort of spatial "mixing" of the original image according to some rule. Consider the following rule: the pixel in position $(x, y)$ in the new image comes from position $(x-1, y)$ in the old image. We can conveniently describe this modification with a filter:

$$
\begin{bmatrix}
\color{blue}{0} & 0 & 0 \\
\color{green}{1} & \color{red}{0} & 0 \\
0 & 0 & 0
\end{bmatrix}
$$

A filter essentially "stamps" several scaled and shifted copies of the original image, and then adds them all up. In this case, the result is a single copy of the original image shifted leftward by $1$ pixel, since the only non-zero entry (in green) stamps out a copy shifted leftward relative to the filter's center. To further develop your understanding, consider the following tweaks:

- If the green entry was $\neq 1$, the stamped copy would also scale the pixel intensities. If it were, say, $0.5$, we would get a left-shifted and *dimmed* copy of the original image.
- If instead the entry in red was $1$, and the other entries were $0$, the filter would do *absolutely nothing*.  
- If both the red and green entries were $1$, we would get the sum of the original image and a left-shifted copy. This would effectively "blur" the image in the horizontal direction.
- What would be the effect of setting only the *blue* pixel to be non-zero?

Consider now the "box filter" below:

$$
\begin{bmatrix}
\frac{1}{9} & \frac{1}{9} & \frac{1}{9} \\
\frac{1}{9} & \frac{1}{9} & \frac{1}{9} \\
\frac{1}{9} & \frac{1}{9} & \frac{1}{9}
\end{bmatrix}
$$

This will add *nine* copies of the original image, each shifted by 1 pixel in a different direction and scaled to be $1 / 9$ as bright. I interpret this filter as something which "spreads out" the energy formerly concentrated in just one pixel. Suppose the original image had a single bright pixel at $(x, y)$; the filter spreads this energy to all its neighbors, so that the resulting image has $9$ dimmer pixels instead. Thus, this filter[^1] results in a blur:

![Copies of the cameraman scaled by a box filter and added up; then full, same, and valid crops]({{ '/cs180/2/images/animations/box_filter_stamps.gif' | relative_url }})

Note that we had to deal with some edge cases, in our dealing with the edges. Hence we define three 'modes' of discrete convolution:

- **full** keeps all of the stamped entries, even those which contain information from only one copy.
- **same** truncates *some* entries so that the result keeps the original image's dimensions.
- **valid** keeps only the entries that are made from *all* of the stamped copies.

That's a visual and intuitive explanation of convolution. I hope it was not too convoluted! It turns out there there is a [mathemical equation]([https://en.wikipedia.org/wiki/Convolution](https://en.wikipedia.org/wiki/Convolution)) to model the adding-up of scaled and shifted copies of an image according to a filter. Here is the first part of some code that computes this, in case you are grading me:

```python
def homemade_conv2D(s, f, mode):
    # ---- original dimensions ----
    h_s, w_s = s.shape
    h_f, w_f = f.shape

    # ---- padding ----
    s_padded = zero_pad(s, f, mode)

    # ---- determine result size ----
    res = get_empty_res(s, f, mode)
    h_r, w_r = res.shape
```

The details of zero padding and the size of the empty result image are determined by our choice of 'mode' according to the edge cases explained above. For example, in the **valid** case, the image is not zero padded so that we only add up entries which exist in the original matrix, and the empty result matrix is made to be smaller than the original image.

Then we can compute each filtered pixel one-by-one, by scaling and adding source pixels according to the filter.

```python
# ---- flip-and-drag style convolution ----
ff = np.flip(f)
for n in range(h_r):
    for m in range(w_r):
        px = 0.0
        for u in range(h_f):
            for v in range(w_f):
                value = s_padded[n+u, m+v]
                weight = ff[u, v]
                px += value * weight
        res[n, m] = px
```

The code below - which I call "cookie-cutter" style because it slices out the region of the original image which contributes to each filtered pixel, like a cookie-mold does to a sheet of dough - does the same thing, but faster. This is because `numpy` operations are "vectorized," i.e., faster than python `for` loops. In fact, you could do better still with `scipy.signal.convolve2d`, which calls highly optimized C code to compute a convolution.

```python
# ---- cookie-cutter style convolution ----
ff = np.flip(f)
for n in range(h_r):
    for m in range(w_r):
        patch = s_padded[n:n+h_f, m:m+w_f]
        res[n, m] = np.sum(patch * ff)
```

Check out the results of some convolutions computed with the following filters:

- box blur - $9 \times 9$, weighted similarly to the filter in the animation above. it turns out that this filter causes some artifacts (called [gibbs ringing](https://en.wikipedia.org/wiki/Ringing_artifacts)) because of the sharp 'drop' from $1 / 81$ to $0$ at the edges of the filter.
- gaussian blur - $9 \times 9$, weighted so as to resemble a gaussian. this reduces the ringing artifacts seen with a basic box blur.
- dx - $1 \times 3$, weighted so that horizontal edges are accentuated.
- dy - $3 \times 1$, weighted so that vertical edges are accentuated.

<figure class="carousel" data-carousel tabindex="0" aria-roledescription="carousel" aria-label="Basic filter results on a self portrait">
  <div class="carousel-viewport">
    <ul class="carousel-track">
      <li class="carousel-slide">
        <img src="{{ '/cs180/2/images/selfs/none_self.jpg' | relative_url }}" alt="Original self portrait, unfiltered">
        <p class="carousel-caption">original</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/2/images/selfs/boxblur_self.jpg' | relative_url }}" alt="Self portrait after a box blur">
        <p class="carousel-caption">box blur</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/2/images/selfs/gaussian_blur_self.jpg' | relative_url }}" alt="Self portrait after a gaussian blur">
        <p class="carousel-caption">gaussian blur</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/2/images/selfs/dx_self.jpg' | relative_url }}" alt="Self portrait after a horizontal derivative filter">
        <p class="carousel-caption">dx</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/2/images/selfs/dy_self.jpg' | relative_url }}" alt="Self portrait after a vertical derivative filter">
        <p class="carousel-caption">dy</p>
      </li>
    </ul>
  </div>
  <div class="carousel-controls">
    <button type="button" class="carousel-btn" data-carousel-prev aria-label="Previous slide">Prev</button>
    <div class="carousel-dots" role="tablist" aria-label="Slides">
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show original" aria-current="true"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show box blur"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show gaussian blur"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show dx"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show dy"></button>
    </div>
    <button type="button" class="carousel-btn" data-carousel-next aria-label="Next slide">Next</button>
  </div>
</figure>

Notice that the dx and dy filters show edges in only one direction; we can emphasize edges in _all_ directions by computing the gradient $\text{dx}^2 + \text{dy}^2$.

<div class="grad-eq" role="img" aria-label="dx squared plus dy squared yields the gradient">
  <figure class="has-sq">
    <img src="{{ '/cs180/2/images/cameraman/dx_cameraman.jpg' | relative_url }}" alt="Horizontal derivative of the cameraman">
    <span class="sq" aria-hidden="true">2</span>
    <figcaption>dx</figcaption>
  </figure>
  <span class="op" aria-hidden="true">+</span>
  <figure class="has-sq">
    <img src="{{ '/cs180/2/images/cameraman/dy_cameraman.jpg' | relative_url }}" alt="Vertical derivative of the cameraman">
    <span class="sq" aria-hidden="true">2</span>
    <figcaption>dy</figcaption>
  </figure>
  <span class="op" aria-hidden="true">→</span>
  <figure>
    <img src="{{ '/cs180/2/images/cameraman/grad_cameraman.jpg' | relative_url }}" alt="Gradient magnitude of the cameraman">
    <figcaption>gradient</figcaption>
  </figure>
</div>

The gradient picks up "edges" in small "noisy" details, which isn't really what we want with an edge detector. Check out the background and foreground - textured parts of the scene, like grass, show up in the gradient image. We can fix this by thresholding, i.e., setting all image values below a certain value to $0$:

<div class="image-row">
  <figure>
    <img src="{{ '/cs180/2/images/cameraman/grad_t10_cameraman.jpg' | relative_url }}" alt="Cameraman gradient thresholded at 10 percent">
    <figcaption>10% of max</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/2/images/cameraman/grad_t20_cameraman.jpg' | relative_url }}" alt="Cameraman gradient thresholded at 20 percent">
    <figcaption>20% of max</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/2/images/cameraman/grad_t50_cameraman.jpg' | relative_url }}" alt="Cameraman gradient thresholded at 50 percent">
    <figcaption>50% of max</figcaption>
  </figure>
</div>

I think the $20\%$ threshold looks best, because it removes most of the noisy details but retains edges. Notice that the $50\%$ threshold is too high, harming the edges' visual integrity.

Here is another way to remove the "noisy" details, using the fact that a blur averages each pixel with its neighbors, thereby smoothing out rough textures. For example, see the selfies above, where the gaussian blur removed sharp edges between buildings in the background. A clever trick is to incorporate a blur into our edge detector. The animation below explains the strategy.[^2]

![Animation of DOG edge detection]({{ '/cs180/2/images/animations/convolution_modes.gif' | relative_url }})

It turns out that convolution is *associative*. In english, the derivative of a blurred image is equivalent to the blurred derivative of an image. These blurred derivatives are called "derivative of gaussian" (DOG) filters. You compute one by convolving a derivative with a gaussian.

<div class="grad-eq kernels" role="img" aria-label="dx convolved with a 21 by 21 gaussian yields a derivative of gaussian">
  <figure>
    <img src="{{ '/cs180/2/images/filters/dx_filter.png' | relative_url }}" alt="Horizontal derivative filter">
    <figcaption>dx</figcaption>
  </figure>
  <span class="op" aria-hidden="true">∗</span>
  <figure>
    <img src="{{ '/cs180/2/images/filters/gaussian_21.png' | relative_url }}" alt="21 by 21 gaussian blur filter">
    <figcaption>gaussian</figcaption>
  </figure>
  <span class="op" aria-hidden="true">→</span>
  <figure>
    <img src="{{ '/cs180/2/images/filters/dog_dx_21.png' | relative_url }}" alt="Horizontal derivative of gaussian filter, size 21">
    <figcaption>DOG</figcaption>
  </figure>
</div>

<div class="grad-eq kernels" role="img" aria-label="dy convolved with a 21 by 21 gaussian yields a derivative of gaussian">
  <figure>
    <img src="{{ '/cs180/2/images/filters/dy_filter.png' | relative_url }}" alt="Vertical derivative filter">
    <figcaption>dy</figcaption>
  </figure>
  <span class="op" aria-hidden="true">∗</span>
  <figure>
    <img src="{{ '/cs180/2/images/filters/gaussian_21.png' | relative_url }}" alt="21 by 21 gaussian blur filter">
    <figcaption>gaussian</figcaption>
  </figure>
  <span class="op" aria-hidden="true">→</span>
  <figure>
    <img src="{{ '/cs180/2/images/filters/dog_dy_21.png' | relative_url }}" alt="Vertical derivative of gaussian filter, size 21">
    <figcaption>DOG</figcaption>
  </figure>
</div>

Here are some results of applying a DOG[^3] and then thresholding:

<div class="image-row long-cap">
  <figure>
    <img src="{{ '/cs180/2/images/cameraman/dog_t40_7_cameraman.jpg' | relative_url }}" alt="Cameraman edges from a 7 by 7 derivative of gaussian, thresholded at 40 percent">
    <figcaption>7×7 blur kernel · 40% threshold</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/2/images/cameraman/dog_t30_21_cameraman.jpg' | relative_url }}" alt="Cameraman edges from a 21 by 21 derivative of gaussian, thresholded at 30 percent">
    <figcaption>21×21 blur kernel · 30% threshold</figcaption>
  </figure>
</div>

Applying more blur indeed removes more of the "undesired" background edges. However, this also blurs the edges, so I prefer the mild blur because the edges are sharper.

There is actually another strategy for edge detection, called the [Laplacian](https://en.wikipedia.org/wiki/Laplace_operator), which basically tells us how much each point differs the local average. You can approximate it with a $2\text{D}$ filter:

<div class="grad-eq kernels long" role="img" aria-label="dx convolved with dx plus dy convolved with dy equals a laplacian">
  <figure>
    <img src="{{ '/cs180/2/images/filters/dx_fwd.png' | relative_url }}" alt="Horizontal forward difference filter">
    <figcaption>dx</figcaption>
  </figure>
  <span class="op" aria-hidden="true">∗</span>
  <figure>
    <img src="{{ '/cs180/2/images/filters/dx_fwd.png' | relative_url }}" alt="Horizontal forward difference filter">
    <figcaption>dx</figcaption>
  </figure>
  <span class="op" aria-hidden="true">+</span>
  <figure>
    <img src="{{ '/cs180/2/images/filters/dy_fwd.png' | relative_url }}" alt="Vertical forward difference filter">
    <figcaption>dy</figcaption>
  </figure>
  <span class="op" aria-hidden="true">∗</span>
  <figure>
    <img src="{{ '/cs180/2/images/filters/dy_fwd.png' | relative_url }}" alt="Vertical forward difference filter">
    <figcaption>dy</figcaption>
  </figure>
  <span class="op" aria-hidden="true">=</span>
  <figure>
    <img src="{{ '/cs180/2/images/filters/laplacian_filter.png' | relative_url }}" alt="Laplacian filter from forward differences">
    <figcaption>laplacian</figcaption>
  </figure>
</div>

<div class="image-row">
  <figure>
    <img src="{{ '/cs180/2/images/cameraman/laplace_cameraman.jpg' | relative_url }}" alt="Cameraman after a basic laplacian filter">
    <figcaption>laplacian</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/2/images/cameraman/laplace_t10_cameraman.jpg' | relative_url }}" alt="Cameraman laplacian thresholded at 10 percent">
    <figcaption>10% threshold</figcaption>
  </figure>
</div>

The results aren't quite as good; the threshold actually removes some edges (see the cameraman's coat) we'd rather keep _before_ the textured grass. The results aren't quite as good as the gradient because pixels in "noisy" areas, i.e. grass, tend to be very different from the *local average*. The Laplacian likes *peaks* or *troughs* in pixel brightness, which is not exactly what we want from an edge detector; rather, we want to detect sharp change in one direction.

Applying a blur is therefore *more important* for the laplacian; a blur effectively averages pixels which removes exactly the type of non-edge "noise" we don't want to see. Check out the results of applying a blurred Laplacian - I coin this filter the "LOG" - and then thresholding.

<div class="grad-eq kernels" role="img" aria-label="laplacian convolved with a 21 by 21 gaussian yields a blurred laplacian">
  <figure>
    <img src="{{ '/cs180/2/images/filters/laplacian_filter.png' | relative_url }}" alt="Laplacian filter">
    <figcaption>laplacian</figcaption>
  </figure>
  <span class="op" aria-hidden="true">∗</span>
  <figure>
    <img src="{{ '/cs180/2/images/filters/gaussian_21.png' | relative_url }}" alt="21 by 21 gaussian blur filter">
    <figcaption>gaussian</figcaption>
  </figure>
  <span class="op" aria-hidden="true">→</span>
  <figure>
    <img src="{{ '/cs180/2/images/filters/laplacian_b_21.png' | relative_url }}" alt="Laplacian of gaussian filter, size 21">
    <figcaption>LOG</figcaption>
  </figure>
</div>

<div class="image-row long-cap">
  <figure>
    <img src="{{ '/cs180/2/images/cameraman/laplace_t30_7_cameraman.jpg' | relative_url }}" alt="Cameraman laplacian from a 7 by 7 blur, thresholded at 30 percent">
    <figcaption>7×7 LOG · 30% threshold</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/2/images/cameraman/laplace_t30_21_cameraman.jpg' | relative_url }}" alt="Cameraman laplacian from a 21 by 21 blur, thresholded at 30 percent">
    <figcaption>21×21 LOG · 30% threshold</figcaption>
  </figure>
</div>

### Fun with Frequencies

To _sharpen_ an image means to emphasize the _edges_. How can we do this with filters? Consider the results of applying gaussian filters shown in Part 1. These give a blurry, _low-frequency estimate_ of the original image. Intuitively, subtracting the blurry image from the original will give a _high-frequency estimate_.

<div class="grad-eq photos" role="img" aria-label="original minus the blurred image yields the high-pass image">
  <figure>
    <img src="{{ '/cs180/2/images/sharp/9_0.0_taj.jpg' | relative_url }}" alt="Taj Mahal, original">
    <figcaption>original</figcaption>
  </figure>
  <span class="op" aria-hidden="true">−</span>
  <figure>
    <img src="{{ '/cs180/2/images/sharp/blurredfirst_9_0.0_taj.jpg' | relative_url }}" alt="Taj Mahal after a gaussian blur">
    <figcaption>blurred</figcaption>
  </figure>
  <span class="op" aria-hidden="true">=</span>
  <figure>
    <img src="{{ '/cs180/2/images/sharp/high_pass_9_taj.jpg' | relative_url }}" alt="High frequencies of the Taj Mahal">
    <figcaption>edges</figcaption>
  </figure>
</div>

Notice that the high-frequency estimate contains edges. Therefore, we can sharpen by adding the high frequency estimate (scaled, depending on your desired "sharp level") to the original.

<div class="grad-eq photos" role="img" aria-label="original plus the high-pass image yields a sharpened taj">
  <figure>
    <img src="{{ '/cs180/2/images/sharp/9_0.0_taj.jpg' | relative_url }}" alt="Taj Mahal, unsharpened">
    <figcaption>original</figcaption>
  </figure>
  <span class="op" aria-hidden="true">+</span>
  <figure>
    <img src="{{ '/cs180/2/images/sharp/high_pass_9_taj.jpg' | relative_url }}" alt="High frequencies of the Taj Mahal">
    <figcaption>edges</figcaption>
  </figure>
  <span class="op" aria-hidden="true">=</span>
  <figure>
    <img src="{{ '/cs180/2/images/sharp/9_5.0_taj.jpg' | relative_url }}" alt="Taj Mahal sharpened with alpha 5">
    <figcaption>sharpened</figcaption>
  </figure>
</div>

You can also play with the blur level; more blur $\rightarrow$ less frequencies in the low frequency estimate $\rightarrow$ more frequencies in the high frequency estimate that get "boosted" by the sharpening filter.

Also, this strategy ultimately does __not__ add new high frequency information, rather it emphasizes the existing high frequency information. Hence, if you try to sharpen a _blurred_ image, the results will not be as good. Confirm this visually by turning on 'pre-blur.'

<div class="sharp-demo" data-sharp-demo data-base="{{ '/cs180/2/images/sharp' | relative_url }}">
  <div class="sharp-controls">
    <div class="sharp-control">
      <span class="sharp-control-label">blur</span>
      <div class="sharp-toggle" role="group" aria-label="Gaussian size">
        <button type="button" data-sharp-blur="3" aria-pressed="false">3</button>
        <button type="button" data-sharp-blur="9" aria-pressed="true">9</button>
        <button type="button" data-sharp-blur="15" aria-pressed="false">15</button>
        <button type="button" data-sharp-blur="21" aria-pressed="false">21</button>
      </div>
    </div>
    <div class="sharp-control">
      <span class="sharp-control-label">pre-blur</span>
      <div class="sharp-toggle" role="group" aria-label="Blur before sharpening">
        <button type="button" data-sharp-first="0" aria-pressed="true">off</button>
        <button type="button" data-sharp-first="1" aria-pressed="false">on</button>
      </div>
    </div>
  </div>

  <div class="image-row">
    <figure>
      <img src="{{ '/cs180/2/images/sharp/9_1.0_taj.jpg' | relative_url }}" data-sharp-file="{p}{b}_1.0_taj.jpg" alt="Taj Mahal sharpened with alpha 1">
      <figcaption>×1</figcaption>
    </figure>
    <figure>
      <img src="{{ '/cs180/2/images/sharp/9_5.0_taj.jpg' | relative_url }}" data-sharp-file="{p}{b}_5.0_taj.jpg" alt="Taj Mahal sharpened with alpha 5">
      <figcaption>×5</figcaption>
    </figure>
    <figure>
      <img src="{{ '/cs180/2/images/sharp/9_15.0_taj.jpg' | relative_url }}" data-sharp-file="{p}{b}_15.0_taj.jpg" alt="Taj Mahal sharpened with alpha 15">
      <figcaption>×15</figcaption>
    </figure>
  </div>

  <div class="image-row">
    <figure>
      <img src="{{ '/cs180/2/images/sharp/9_1.0_gateway.jpg' | relative_url }}" data-sharp-file="{p}{b}_1.0_gateway.jpg" alt="Gateway of India sharpened with alpha 1">
      <figcaption>×1</figcaption>
    </figure>
    <figure>
      <img src="{{ '/cs180/2/images/sharp/9_5.0_gateway.jpg' | relative_url }}" data-sharp-file="{p}{b}_5.0_gateway.jpg" alt="Gateway of India sharpened with alpha 5">
      <figcaption>×5</figcaption>
    </figure>
    <figure>
      <img src="{{ '/cs180/2/images/sharp/9_15.0_gateway.jpg' | relative_url }}" data-sharp-file="{p}{b}_15.0_gateway.jpg" alt="Gateway of India sharpened with alpha 15">
      <figcaption>×15</figcaption>
    </figure>
  </div>
</div>

#### Hybrid Images

It turns out that human vision relies on lower spatial frequencies to view far-away objects. I think that this is because the angular resolution of human vision is (roughly) fixed; from far away, the eye can only resolve features with greater separation, compared to the features resolvable from nearby. Hence, we simply cannot resolve the high frequency details that are resolvable up close. 

We can take advantage of this to do a cool trick with some high- and low- frequency estimates, obtained in the same way as in the previous section. In particular, we can add the low frequencies from one image ($A$) to another image's ($B$) high frequencies. From up close, you'll be able to see the high frequency details and resolve $A$, but from far away you'll only see the low frequency estimate of $B$. 

I implemented high pass and low pass filters as a function of cycles per pixel; then created high- and low- frequency estimates; and then added them together. I also added some gain to the high frequency image, to account for the fact that most energy of natural images is in the low frequencies, and we removed those. After tweaking these parameters[^4], I got the following results:

<div class="hybrid-pair" data-hybrid-demo>
  <div class="sharp-controls">
    <div class="sharp-control">
      <span class="sharp-control-label">zoom</span>
      <div class="sharp-toggle" role="group" aria-label="Nutmeg derek viewing distance">
        <button type="button" data-hybrid-zoom="in" aria-pressed="true">in</button>
        <button type="button" data-hybrid-zoom="out" aria-pressed="false">out</button>
      </div>
    </div>
  </div>
  <div class="hybrid-trio">
    <div class="hybrid-sources">
      <figure>
        <img src="{{ '/cs180/2/images/hybrid/nutmeg.jpg' | relative_url }}" alt="Nutmeg, the high-frequency source">
        <figcaption>nutmeg · near</figcaption>
      </figure>
      <figure>
        <img src="{{ '/cs180/2/images/hybrid/derek.jpg' | relative_url }}" alt="Derek, the low-frequency source">
        <figcaption>derek · far</figcaption>
      </figure>
    </div>
    <figure class="hybrid-result">
      <img src="{{ '/cs180/2/images/hybrid/derek_and_nutmeg.jpg' | relative_url }}" alt="Hybrid of nutmeg and derek">
      <figcaption>hybrid</figcaption>
    </figure>
  </div>
</div>

You can see the blurry background image by squinting or by walking a few meters away from the screen. Pressing the 'out' button downsamples the source image, which doesn't _really_ use the frequency sensitivity of your eyes, but it emphasizes the fact that the blurry image lives in the low frequencies.

<div class="hybrid-pair" data-hybrid-demo>
  <div class="sharp-controls">
    <div class="sharp-control">
      <span class="sharp-control-label">zoom</span>
      <div class="sharp-toggle" role="group" aria-label="Anakin vader viewing distance">
        <button type="button" data-hybrid-zoom="in" aria-pressed="true">in</button>
        <button type="button" data-hybrid-zoom="out" aria-pressed="false">out</button>
      </div>
    </div>
  </div>
  <div class="hybrid-trio">
    <div class="hybrid-sources">
      <figure>
        <img src="{{ '/cs180/2/images/hybrid/anakin.jpg' | relative_url }}" alt="Anakin, the high-frequency source">
        <figcaption>anakin · near</figcaption>
      </figure>
      <figure>
        <img src="{{ '/cs180/2/images/hybrid/vader.jpg' | relative_url }}" alt="Vader, the low-frequency source">
        <figcaption>vader · far</figcaption>
      </figure>
    </div>
    <figure class="hybrid-result">
      <img src="{{ '/cs180/2/images/hybrid/anakin_and_vader.jpg' | relative_url }}" alt="Hybrid of anakin and vader">
      <figcaption>hybrid</figcaption>
    </figure>
  </div>
</div>

<div class="hybrid-pair" data-hybrid-demo>
  <div class="sharp-controls">
    <div class="sharp-control">
      <span class="sharp-control-label">zoom</span>
      <div class="sharp-toggle" role="group" aria-label="White house viewing distance">
        <button type="button" data-hybrid-zoom="in" aria-pressed="true">in</button>
        <button type="button" data-hybrid-zoom="out" aria-pressed="false">out</button>
      </div>
    </div>
  </div>
  <div class="hybrid-trio">
    <div class="hybrid-sources">
      <figure>
        <img src="{{ '/cs180/2/images/hybrid/wh_before.jpg' | relative_url }}" alt="East Wing of the White House, the high-frequency source">
        <figcaption>East wing</figcaption>
      </figure>
      <figure>
        <img src="{{ '/cs180/2/images/hybrid/wh_after.jpg' | relative_url }}" alt='"Ballroom" at the White House, the low-frequency source'>
        <figcaption>"Ballroom"</figcaption>
      </figure>
    </div>
    <figure class="hybrid-result">
      <img src="{{ '/cs180/2/images/hybrid/whitehouse.jpg' | relative_url }}" alt="Hybrid of White House before and after">
      <figcaption>hybrid</figcaption>
    </figure>
  </div>
</div>

Let's see what happens in the frequency domain for my favorite image of the three, Anakin. The frequency domain is a representation of an image by the frequencies that make it up. It turns out that _convolution_ in space is equivalent to _multiplication_ in frequency.[^5]

<div class="grad-eq photos" role="img" aria-label="low-pass filter spectrum times vader spectrum yields the low-pass image spectrum">
  <figure>
    <img src="{{ '/cs180/2/images/hybrid/fft_lpf_vader.jpg' | relative_url }}" alt="Zero-padded FFT of the low-pass filter">
    <figcaption>lpf</figcaption>
  </figure>
  <span class="op" aria-hidden="true">×</span>
  <figure>
    <img src="{{ '/cs180/2/images/hybrid/fft_vader.jpg' | relative_url }}" alt="Fourier magnitude of vader">
    <figcaption>fft</figcaption>
  </figure>
  <span class="op" aria-hidden="true">=</span>
  <figure>
    <img src="{{ '/cs180/2/images/hybrid/fft_lp_vader.jpg' | relative_url }}" alt="Fourier magnitude of low-passed vader">
    <figcaption>fft lp</figcaption>
  </figure>
</div>

We see that a LPF removed all the little speckles from the outer regions of the frequency domain. The only information (i.e. bright pixels) that survives is near the low frequencies in the center.

<div class="grad-eq photos" role="img" aria-label="high-pass filter spectrum times anakin spectrum yields the high-pass image spectrum">
  <figure>
    <img src="{{ '/cs180/2/images/hybrid/fft_hpf_anakin.jpg' | relative_url }}" alt="Zero-padded FFT of the high-pass filter">
    <figcaption>hpf</figcaption>
  </figure>
  <span class="op" aria-hidden="true">×</span>
  <figure>
    <img src="{{ '/cs180/2/images/hybrid/fft_anakin.jpg' | relative_url }}" alt="Fourier magnitude of anakin">
    <figcaption>fft</figcaption>
  </figure>
  <span class="op" aria-hidden="true">=</span>
  <figure>
    <img src="{{ '/cs180/2/images/hybrid/fft_hp_anakin.jpg' | relative_url }}" alt="Fourier magnitude of high-passed anakin">
    <figcaption>fft hp</figcaption>
  </figure>
</div>
 
The effect of a HPF is harder to notice because the high frequencies are naturally much lower-energy (less bright) to begin with. If you look closely, the result looks _darker_ in the center, relative to the rest of the frequency domain.

Adding these, we get the following result frequency representation. Notice that it looks _much more similar_ to the frequency representations we started with than either of the high- or low- passed versions did alone.

<div class="grad-eq photos" role="img" aria-label="low-pass spectrum plus high-pass spectrum yields the hybrid spectrum">
  <figure>
    <img src="{{ '/cs180/2/images/hybrid/fft_lp_vader.jpg' | relative_url }}" alt="Fourier magnitude of low-passed vader">
    <figcaption>fft lp</figcaption>
  </figure>
  <span class="op" aria-hidden="true">+</span>
  <figure>
    <img src="{{ '/cs180/2/images/hybrid/fft_hp_anakin.jpg' | relative_url }}" alt="Fourier magnitude of high-passed anakin">
    <figcaption>fft hp</figcaption>
  </figure>
  <span class="op" aria-hidden="true">=</span>
  <figure>
    <img src="{{ '/cs180/2/images/hybrid/fft_hybrid_anakin_and_vader.jpg' | relative_url }}" alt="Fourier magnitude of the anakin-vader hybrid">
    <figcaption>fft hybrid</figcaption>
  </figure>
</div>

#### Blending Images

How can we blend images together? Simply cropping one image onto another won't look right. The solution is to use _Gaussian Stacks_ and _Laplacian Stacks_, which allow us to view and modify images at multiple scales.

A Gaussian Stack is a sequence of subsequently lower-detail images, obtained by applying low pass filters with increasingly narrow cutoffs. A Laplacian stack takes the difference between the layers of the Gaussian Stack, yielding band-pass frequency estimates of an image. Intuitively, each layer of the Laplacian Stack contains a different level of detail, and we can recover the original image by recombining these levels.

I think the following animation explains this better than I could with words:

![Animation of Gaussian and Laplacian stacks on an apple]({{ '/cs180/2/images/animations/gaussian_laplacian_stacks.gif' | relative_url }})

This is exactly what [Burt and Adelson used in 1983](https://www.cs.princeton.edu/courses/archive/fall05/cos429/papers/burt_adelson.pdf) to combine images of an apple and an orange. They used such a multi-scale stack to blend gradually the blurry estimate at the lowest level, but more abruptly combine the high detail levels. Why does this work? Well, it smoothly blends the smooth changes, and quickly blends the quick changes! The result looks way nicer than you'd get with any single-scale combination, where you'd have to compromise the gradual changes with an abrupt transition or vice versa.

Check out the sequence of half-images below, and the blended counterpart. Notice that the detail images have a clearly defined boundary, but there a smoother transtion in the low frequency images.

<div class="image-row">
  <figure>
    <img src="{{ '/cs180/2/images/oraple/level2_L.jpg' | relative_url }}" alt="Oraple level 2, left apple contribution">
    <figcaption>Level 2 · Left</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/2/images/oraple/level2_R.jpg' | relative_url }}" alt="Oraple level 2, right orange contribution">
    <figcaption>Level 2 · Right</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/2/images/oraple/level2_blended.jpg' | relative_url }}" alt="Oraple level 2, blended">
    <figcaption>Level 2 · Blended</figcaption>
  </figure>
</div>

<div class="image-row">
  <figure>
    <img src="{{ '/cs180/2/images/oraple/level4_L.jpg' | relative_url }}" alt="Oraple level 4, left apple contribution">
    <figcaption>Level 4 · Left</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/2/images/oraple/level4_R.jpg' | relative_url }}" alt="Oraple level 4, right orange contribution">
    <figcaption>Level 4 · Right</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/2/images/oraple/level4_blended.jpg' | relative_url }}" alt="Oraple level 4, blended">
    <figcaption>Level 4 · Blended</figcaption>
  </figure>
</div>

<div class="image-row">
  <figure>
    <img src="{{ '/cs180/2/images/oraple/level6_L.jpg' | relative_url }}" alt="Oraple level 6, left apple contribution">
    <figcaption>Level 6 · Left</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/2/images/oraple/level6_R.jpg' | relative_url }}" alt="Oraple level 6, right orange contribution">
    <figcaption>Level 6 · Right</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/2/images/oraple/level6_blended.jpg' | relative_url }}" alt="Oraple level 6, blended">
    <figcaption>Level 6 · Blended</figcaption>
  </figure>
</div>

By adding together the blended levels we reconstruct the ___legendary oraple___:

<figure class="stack-result">
  <img src="{{ '/cs180/2/images/oraple/oraple.jpg' | relative_url }}" alt="Final oraple blend of apple and orange">
</figure>

I had some fun blending together images. As cool as the final blended result is, it is more fun in my opinion to compare the blended sub-levels (I picked my favorites for each). The low-frequency images transition smoothly, so there is no abrupt change in brightness, while the high frequency images change abruptly, so that small details don't overlap in the transition region.

Here is a blended picture of the white house, before and after the beginning of construction on a _vital_ national security enhancement:

<div class="image-row">
  <figure>
    <img src="{{ '/cs180/2/images/whitehouse/level1_L.jpg' | relative_url }}" alt="White House blend level 1, left">
    <figcaption>Level 1 · Left</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/2/images/whitehouse/level1_R.jpg' | relative_url }}" alt="White House blend level 1, right">
    <figcaption>Level 1 · Right</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/2/images/whitehouse/level1_blended.jpg' | relative_url }}" alt="White House blend level 1, blended">
    <figcaption>Level 1 · Blended</figcaption>
  </figure>
</div>
<div class="image-row">
  <figure>
    <img src="{{ '/cs180/2/images/whitehouse/level3_L.jpg' | relative_url }}" alt="White House blend level 3, left">
    <figcaption>Level 3 · Left</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/2/images/whitehouse/level3_R.jpg' | relative_url }}" alt="White House blend level 3, right">
    <figcaption>Level 3 · Right</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/2/images/whitehouse/level3_blended.jpg' | relative_url }}" alt="White House blend level 3, blended">
    <figcaption>Level 3 · Blended</figcaption>
  </figure>
</div>
<div class="image-row">
  <figure>
    <img src="{{ '/cs180/2/images/whitehouse/level5_L.jpg' | relative_url }}" alt="White House blend level 5, left">
    <figcaption>Level 5 · Left</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/2/images/whitehouse/level5_R.jpg' | relative_url }}" alt="White House blend level 5, right">
    <figcaption>Level 5 · Right</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/2/images/whitehouse/level5_blended.jpg' | relative_url }}" alt="White House blend level 5, blended">
    <figcaption>Level 5 · Blended</figcaption>
  </figure>
</div>
<figure class="stack-result">
  <img src="{{ '/cs180/2/images/whitehouse/whitehouse.jpg' | relative_url }}" alt="Final White House blend">
  <figcaption>Result</figcaption>
</figure>

Here is a blended picture of the [Commissioner's Plan of 1811](https://en.wikipedia.org/wiki/Commissioners%27_Plan_of_1811) for Manhattan, and a screenshot I took of Manhattan from apple maps. It's fascinating that the Manhattan map is 200+ years old!

<div class="blend-demo">
  <div class="image-row">
    <figure>
      <img src="{{ '/cs180/2/images/nyc/level1_L.jpg' | relative_url }}" alt="NYC blend level 1, left">
      <figcaption>Level 1 · Left</figcaption>
    </figure>
    <figure>
      <img src="{{ '/cs180/2/images/nyc/level1_R.jpg' | relative_url }}" alt="NYC blend level 1, right">
      <figcaption>Level 1 · Right</figcaption>
    </figure>
    <figure>
      <img src="{{ '/cs180/2/images/nyc/level1_blended.jpg' | relative_url }}" alt="NYC blend level 1, blended">
      <figcaption>Level 1 · Blended</figcaption>
    </figure>
  </div>
  <div class="image-row">
    <figure>
      <img src="{{ '/cs180/2/images/nyc/level3_L.jpg' | relative_url }}" alt="NYC blend level 3, left">
      <figcaption>Level 3 · Left</figcaption>
    </figure>
    <figure>
      <img src="{{ '/cs180/2/images/nyc/level3_R.jpg' | relative_url }}" alt="NYC blend level 3, right">
      <figcaption>Level 3 · Right</figcaption>
    </figure>
    <figure>
      <img src="{{ '/cs180/2/images/nyc/level3_blended.jpg' | relative_url }}" alt="NYC blend level 3, blended">
      <figcaption>Level 3 · Blended</figcaption>
    </figure>
  </div>
  <figure class="stack-result tall">
    <img src="{{ '/cs180/2/images/nyc/nyc.jpg' | relative_url }}" alt="Final NYC satellite and map blend">
    <figcaption>Result</figcaption>
  </figure>
</div>

Finally, we will repeat the _exact same process_ as above with some irregular masks to do a more-interesting image blend. In particular, we will

1. compute the laplacian stack of two base images, decomposing them by detail level (i.e. isolating one frequency band at a time)
2. compute the gaussian stack of an irregular mask that covers some part of one of the images. like before, this allows us to abruptly change high frequency estimate while smoothly blending the low frequencies.
3. apply the appropriate mask to each level of the Laplacian Stack
4. add together the results for a cool blended image!

I did all the alignment and mask-creation with my all-time-favorite photo-editing suite: __Google Slides__.

For my first image, I selected this selfie I took of my brother and I; we dressed up as Donkey and Shrek for a race called _Bay to Breakers_, which happens each May in San Francisco. It felt right to add the real deal to this picture.
<div class="image-row">
  <figure>
    <img src="{{ '/cs180/2/images/swamp/level3_blended.jpg' | relative_url }}" alt="Swamp blend level 3, blended">
    <figcaption>Level 3 · Blended</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/2/images/swamp/level5_blended.jpg' | relative_url }}" alt="Swamp blend level 5, blended">
    <figcaption>Level 5 · Blended</figcaption>
  </figure>
</div>
<figure class="stack-result wide">
  <img src="{{ '/cs180/2/images/swamp/swamp.jpg' | relative_url }}" alt="Final swamp blend of Shrek into a waterfall photo">
  <figcaption>Final result</figcaption>
</figure>

While looking through my camera roll for more good images to blend of a more-personal flavor, I found a group photo taken on the last day of the MRI class of myself, my buddies Arvind and Parsa, and Miki and Rinni (who was the professor and TA respectively). Ever since taking this photo, I've _really regretted_ including Arvind on this one.[^6] The guy is just _so damn old_! Anyway, with the knowledge gained in this project, I figured I could _finally_ fix this tragedy! My solution: I stalked Arvind's travel blog, locating a suitable picture of a more spry and youthful Arvind, and replaced the old fart fogging up this otherwise treasured memory of mine.

<div class="image-row">
  <figure>
    <img src="{{ '/cs180/2/images/yung_arvind/level5_blended.jpg' | relative_url }}" alt="Yung Arvind blend level 5, blended">
    <figcaption>Level 5 · Blended</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/2/images/yung_arvind/level7_blended.jpg' | relative_url }}" alt="Yung Arvind blend level 7, blended">
    <figcaption>Level 7 · Blended</figcaption>
  </figure>
</div>
<figure class="stack-result wide">
  <img src="{{ '/cs180/2/images/yung_arvind/yung_arvind.jpg' | relative_url }}" alt="Final group photo blend with a younger Arvind">
  <figcaption>Final result</figcaption>
</figure>

For my final swap, I want you to guess which of these is the original[^7]:

<div class="image-row">
  <figure>
    <img src="{{ '/cs180/2/images/jeffryan/original.jpg' | relative_url }}" alt="Original Jeff and Ryan photo">
  </figure>
  <figure>
    <img src="{{ '/cs180/2/images/jeffryan/jeffryan.jpg' | relative_url }}" alt="Swapped Jeff and Ryan blend">
  </figure>
</div>

[^1]: The GIF actually uses a $27 \times 27$ filter, chunked into $3 \times 3$ "pixels." That is, each addition is actually the addition of all 9 copies coming from a $3 \times 3$ chunk. This exaggerates the effect of an analogous $3 \times 3$ box filter, for the sake of visualization.

[^2]: I made the animation with pixel *value* cutoffs, but later decided it would be more useful to define a threshold based on the percent of the maximum pixel value.

[^3]: Since convolution is also *commutative*, you'd get the same results regardless of the order in which the blur and the derivative are applied. There are are some tricks you have to play with these discrete and finite support image signals, however, regarding the convolution mode so that they match exactly.

[^4]: HP · LP · GAIN cutoffs of: $0.082$ · $0.017$ · $5.7$ for derek / nutmeg, $0.076$ · $0.027$ · $2.8$ for anakin / vader, and $0.092$ · $0.18$ · $1.2$ for whitehouse.

[^5]: Consider an ideal low-frequency-passing filter. In the space domain, you can apply a blur filter that smooths out the high-frequency details. Equivalently, you could look at the _frequency_ domain, and set all the low frequencies to $0$ but leave the high frequencies alone. Hence you could implement a low-frequency-passing filter by _multiplying_ the frequency representation with some sort of "mask" that is $1$ for frequencies you want to keep, and $0$s elsewhere. While the convolution-multiplication equivalence is complicated to prove, hopefully this example lends it some believability.

[^6]: This is entirely a joke. If Arvind is an apple and I'm an orange, together we make a truly well-blended oraple.

[^7]: Left. Jeffery's face is way bigger than mine so this one took several attempts; notice that I had to increase the size of mine to fit over his.

