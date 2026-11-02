---
layout: default
title: Project 4
---

# Project 4

## Image Warping and Mosaicing

During the zeroth project in this class, I got to explore the way images are formed by a camera. It was helpful to imagine the field of view of a camera as a cone emanating outwards from the lens; equivalently, as some some light rays bouncing off objects and shooting through the camera's center of projection to land on the sensor. The picture is therefore a patch of the world - I like to think of the world, as a camera sees it, as objects pictures on spheres of different sizes centered on the center of projection - projected / flattened onto a plane. When you rotate the camera about its center of projection, you are just pointing the cone at a *different patch* of the *same spheres*. In this project I take a bunch of these picture-patches and stitch them together to create a mosaic. This is something like the panorama-mode of a cell phone camera. 

For this to work, you *must* take pictures from the *same* location, so that those pictures capture the *same* rays of light. Imagine a pinhole camera, where the camera sensor (image plane) collects all of the rays of light shooting through a tiny pinhole. If you rotate the camera, such that the pinhole is in the same spot, the rays captured in both images are the same. Note that if you *translate* the camera, this won't be true! 

Consider this drawing:

<figure>
  <img src="images/cop_diagram.png" alt="sketch: rays from a person, a tree, a bird, and a house all pass through one center of projection and land on two differently tilted image planes, red and blue; the ray from the house only reaches the extended blue plane">
</figure>

The black dot is the 'pinhole' or 'center of projection' through which all the light rays pass, to land on the camera sensors (solid blue/red lines). Clearly, the *exact same* light rays (dotted red/blue lines) land on the sensors.

Assuming that the center of projection is the same in two images, you can use the fact that the rays coming from objects pictured in both images are identical, to compute something called a "homography." This transforms pixels in image red so that they "live" in the same coordinate system as image blue. In other words, you can _re-project_ the rays you captured in red onto the same image plane as that which blue was formed on.

For example, you could reproject the orange light ray captured by the red image onto the blue image's plane to *extend the field of view of the blue image!*

To reiterate: it's OK to rotate the camera, but you _cannot_ translate it, to ensure that the rays of light appearing in both images are the same. Here are some sets of pictures I took, doing my best to hold my phone still while rotating around the camera's location.

##### Playground and Courts
<div class="image-row cols-3">
  <figure>
    <img src="images/playground_left.jpg" alt="the playground by the tennis courts, left image">
    <figcaption>left</figcaption>
  </figure>
  <figure>
    <img src="images/playground_middle.jpg" alt="the playground by the tennis courts, middle image">
    <figcaption>middle</figcaption>
  </figure>
  <figure>
    <img src="images/playground_right.jpg" alt="the playground by the tennis courts, right image">
    <figcaption>right</figcaption>
  </figure>
</div>

##### Playground and a Sandbox
<div class="image-row cols-3">
  <figure>
    <img src="images/groundplay_left.jpg" alt="the sandbox playground, left image">
    <figcaption>left</figcaption>
  </figure>
  <figure>
    <img src="images/groundplay_middle.jpg" alt="the sandbox playground, middle image">
    <figcaption>middle</figcaption>
  </figure>
  <figure>
    <img src="images/groundplay_right.jpg" alt="the sandbox playground, right image">
    <figcaption>right</figcaption>
  </figure>
</div>

##### Pantry
<div class="image-row cols-2">
  <figure>
    <img src="images/pantry_left.jpg" alt="my pantry, left image">
    <figcaption>left</figcaption>
  </figure>
  <figure>
    <img src="images/pantry_right.jpg" alt="my pantry, right image">
    <figcaption>right</figcaption>
  </figure>
</div>

##### Closet
<div class="image-row cols-2">
  <figure>
    <img src="images/closet_top.jpg" alt="my closet, top image">
    <figcaption>top</figcaption>
  </figure>
  <figure>
    <img src="images/closet_bottom.jpg" alt="my closet, bottom image">
    <figcaption>bottom</figcaption>
  </figure>
</div>

##### Deer
<div class="image-row cols-2">
  <figure>
    <img src="images/deer_left.jpg" alt="a deer resting in the woods, left image">
    <figcaption>left</figcaption>
  </figure>
  <figure>
    <img src="images/deer_right.jpg" alt="a deer resting in the woods, right image">
    <figcaption>right</figcaption>
  </figure>
</div>

### Recovering Homographies

A homography is a $3 \times 3$ matrix $H$ which maps a point $(x, y)$ in one image to a point $(x', y')$ in another. Why a $3 \times 3$ matrix to describe a $2\text{D}$ transformation? 

Intuitively, a $2 \times 2$ matrix always sends $(0, 0)$ to $(0, 0)$, so it can rotate and scale, but it cannot *shift*. By using *homogeneous coordinates*, i.e. tacking a $1$ onto the end of each point to encode a $2\text{D}$ point as a $3\text{D}$ vector, we can encode translation with $H$. The equation relating $(x, y)$ to $(x', y')$ is

$$
\begin{bmatrix} wx' \\ wy' \\ w \end{bmatrix}
=
\begin{bmatrix}
h_1 & h_2 & h_3 \\
h_4 & h_5 & h_6 \\
h_7 & h_8 & 1
\end{bmatrix}
\begin{bmatrix} x \\ y \\ 1 \end{bmatrix}.
$$

In homogeneous coordinates, the $3^{\text{rd}}$ coordinates scales the first two, so $(wx', wy', w)$ is the same as $(x', y')$ for *any* $w$. This is intimately related to the way that a cameras capture light rays from objects; as $w$ varies, $(wx, wy, w)$ traces a line through the origin, i.e. a *ray* through the center of projection, and so dividing by $w$ determines where that ray intersects an image plane at $w=1$. 

Since multiplying all of $H$ by a constant only changes $w$, which we divide out at the end anyway, there are only $8$ unknowns. I think of these as follows. The top two rows alone describes an *affine* transformation (shifting, rotating, scaling). The bottom row is makes $w$ *depend on where you are in the image*, i.e. *projective*, since dividing by $w$ squishes or stretches $(x', y'$) according to $(x, y)$. This accomplishes precisely the "far-away-things look smaller" effect.

Dividing out $w = h_7 x + h_8 y + 1$, we have

$$
x' = \frac{h_1 x + h_2 y + h_3}{h_7 x + h_8 y + 1}, \qquad
y' = \frac{h_4 x + h_5 y + h_6}{h_7 x + h_8 y + 1}.
$$

This isn't yet linear in the unknowns $h_i$, but if we multiply through by the denominator and shuffle things around, we get:

$$
\begin{aligned}
h_1 x + h_2 y + h_3 - h_7 x x' - h_8 y x' &= x' \\
h_4 x + h_5 y + h_6 - h_7 x y' - h_8 y y' &= y'
\end{aligned}
$$

So each pair of corresponding points gives us *two* equations. Stacking up the equations for $n$ pairs of points gives a linear system $A\mathbf{h} = \mathbf{b}$:

$$
\begin{bmatrix}
x_1 & y_1 & 1 & 0 & 0 & 0 & -x_1 x_1' & -y_1 x_1' \\
0 & 0 & 0 & x_1 & y_1 & 1 & -x_1 y_1' & -y_1 y_1' \\
& & & & \vdots & & & \\
x_n & y_n & 1 & 0 & 0 & 0 & -x_n x_n' & -y_n x_n' \\
0 & 0 & 0 & x_n & y_n & 1 & -x_n y_n' & -y_n y_n'
\end{bmatrix}
\begin{bmatrix} h_1 \\ h_2 \\ \vdots \\ h_8 \end{bmatrix}
=
\begin{bmatrix} x_1' \\ y_1' \\ \vdots \\ x_n' \\ y_n' \end{bmatrix}
$$

With $n = 4$ points we have $8$ equations and $8$ unknowns, so we could solve exactly. Since in this part I am clicking corresponding points by hand, there is some error! By clicking more points, we construct an overdetermined system which can be solved robustly by least squares,

$$
\hat{\mathbf{h}} = \arg\min_{\mathbf{h}} \lVert A\mathbf{h} - \mathbf{b} \rVert_2^2,
$$

which in a sense averages out my clicking errors. I picked the points with `matplotlib`'s `ginput`. Here they are for the pantry scene:

<div class="image-row cols-2">
  <figure>
    <img src="images/pantry_pts_left.jpg" alt="left pantry image with ten numbered correspondence points">
    <figcaption>left</figcaption>
  </figure>
  <figure>
    <img src="images/pantry_pts_right.jpg" alt="right pantry image with the matching ten numbered correspondence points">
    <figcaption>right</figcaption>
  </figure>
</div>

There are $10$ pairs of points here, so $20$ equations for $8$ unknowns. Mapping the left image $(x, y)$ into the right image $(x', y')$, the system of equations for these points is

$$
\begin{bmatrix}
610.3 & 161.7 & 1 & 0 & 0 & 0 & -202356.9 & -53616.7 \\
0 & 0 & 0 & 610.3 & 161.7 & 1 & -136293.4 & -36112.4 \\
440.1 & 198.2 & 1 & 0 & 0 & 0 & -86360.1 & -38885.4 \\
0 & 0 & 0 & 440.1 & 198.2 & 1 & -104709.2 & -47147.4 \\
& & & & \vdots & & & \\
621.7 & 348.9 & 1 & 0 & 0 & 0 & -209141.6 & -117382.5 \\
0 & 0 & 0 & 621.7 & 348.9 & 1 & -234554.9 & -131645.9
\end{bmatrix}
\begin{bmatrix} h_1 \\ h_2 \\ \vdots \\ h_8 \end{bmatrix}
=
\begin{bmatrix} 331.5 \\ 223.3 \\ 196.2 \\ 237.9 \\ \vdots \\ 336.4 \\ 377.3 \end{bmatrix}
$$

and the recovered homography is

$$
H =
\begin{bmatrix}
1.556 & -0.037 & -387.1 \\
0.409 & 1.373 & -98.1 \\
1.13 \times 10^{-3} & -6.28 \times 10^{-5} & 1
\end{bmatrix}.
$$

##### Playground and Courts
<div class="image-row cols-2">
  <figure>
    <img src="images/playground_pts_left.jpg" alt="the playground by the tennis courts, left image with 25 numbered correspondence points">
    <figcaption>left</figcaption>
  </figure>
  <figure>
    <img src="images/playground_pts_middle.jpg" alt="the playground by the tennis courts, middle image with the matching 25 numbered correspondence points">
    <figcaption>middle</figcaption>
  </figure>
</div>

##### Playground and a Sandbox
<div class="image-row cols-2">
  <figure>
    <img src="images/groundplay_pts_left.jpg" alt="the sandbox playground, left image with 25 numbered correspondence points">
    <figcaption>left</figcaption>
  </figure>
  <figure>
    <img src="images/groundplay_pts_middle.jpg" alt="the sandbox playground, middle image with the matching 25 numbered correspondence points">
    <figcaption>middle</figcaption>
  </figure>
</div>

##### Closet
<div class="image-row cols-2">
  <figure>
    <img src="images/closet_pts_bottom.jpg" alt="my closet, bottom image with 25 numbered correspondence points">
    <figcaption>bottom</figcaption>
  </figure>
  <figure>
    <img src="images/closet_pts_top.jpg" alt="my closet, top image with the matching 25 numbered correspondence points">
    <figcaption>top</figcaption>
  </figure>
</div>

##### Deer
<div class="image-row cols-2">
  <figure>
    <img src="images/deer_pts_left.jpg" alt="the deer scene, left image with 15 numbered correspondence points">
    <figcaption>left</figcaption>
  </figure>
  <figure>
    <img src="images/deer_pts_right.jpg" alt="the deer scene, right image with the matching 15 numbered correspondence points">
    <figcaption>right</figcaption>
  </figure>
</div>

### Warping the Images

We *could* use $H$ to *forward warp*: for each pixel in the source image, determine its position in the result with $H$ and fill it in. The problem is that $H$ stretches some parts of the image, so the source pixels might land on non-integer positions, which is a problem because pixels are indexed by integers.

Instead we will do *backwards warping*. That is, we will instead iterate through the result pixels, filling them in by applying $H^{-1}$. This is still not an integer, though! Suppose output index $(x', y') = (16, 47)$ maps from input "pixel" $(41.3, 17.8)$. How do we fill in the result? I tried two approaches.

**Nearest neighbor** interpolation just rounds; $(41.3, 17.8)$ becomes $(41, 18)$. This is fast and simple, but it could make edges look bad.

**Bilinear** interpolation computes a weighted average of the four closest pixels, giving more weight to the ones that are closer. This is a bit more robust because it incorporates information from more surrounding pixels.

#### Rectification

To test our warping, we can use the pictures of things we *know* to be rectangular and warp them onto an arbitrary rectangular shape. The result ends up looking as if I took the picture head-on!

##### Book
<figure>
  <img src="images/book_original.jpg" alt="the book, photographed at an angle">
  <figcaption>original</figcaption>
</figure>

<div class="image-row cols-2">
  <figure>
    <img src="images/book_nearest.png" alt="the book rectified with nearest neighbor interpolation">
    <figcaption>nearest neighbor</figcaption>
  </figure>
  <figure>
    <img src="images/book_bilinear.png" alt="the book rectified with bilinear interpolation">
    <figcaption>bilinear</figcaption>
  </figure>
</div>

##### Wallet
<figure>
  <img src="images/wallet_original.jpg" alt="the wallet, photographed at an angle">
  <figcaption>original</figcaption>
</figure>

<div class="image-row cols-2">
  <figure>
    <img src="images/wallet_nearest.png" alt="the wallet rectified with nearest neighbor interpolation">
    <figcaption>nearest neighbor</figcaption>
  </figure>
  <figure>
    <img src="images/wallet_bilinear.png" alt="the wallet rectified with bilinear interpolation">
    <figcaption>bilinear</figcaption>
  </figure>
</div>

##### Nixon
<figure>
  <img src="images/nixon_original.jpg" style="width: 100%;" alt="the Nixon poster, photographed at an angle">
  <figcaption>original</figcaption>
</figure>

<figure>
  <img src="images/nixon_nearest.png" style="width: 100%;" alt="the Nixon poster rectified with nearest neighbor interpolation">
  <figcaption>nearest neighbor</figcaption>
</figure>

<figure>
  <img src="images/nixon_bilinear.png" style="width: 100%;" alt="the Nixon poster rectified with bilinear interpolation">
  <figcaption>bilinear</figcaption>
</figure>

Notice that the $3\text{D}$ structures get distorted, but the flat regions indeed look flat. For example, you can see some subtle waves in the nixon poster - it is not a perfectly flat rectangle! I didn't even notice this until I did the warp. 

The difference between the two interpolation methods is hard to see at this size, so here's a zoomed-in crop of the lettering on the book:

<div class="image-row cols-2">
  <figure>
    <img src="images/book_crop_nearest.png" alt="zoomed crop of the rectified book lettering, nearest neighbor">
    <figcaption>nearest neighbor</figcaption>
  </figure>
  <figure>
    <img src="images/book_crop_bilinear.png" alt="same zoomed crop, bilinear">
    <figcaption>bilinear</figcaption>
  </figure>
</div>

Edges in particular are distorted by the nearest neighbor strategy; a bilinear interpolation results in a smoother, nicer-looking result. The downside is that it is slightly more computationally expensive, since each pixel is a weighted average. I didn't find the slowdown too unbearable, so I will use bilinear interpolation for the remainder of the project.

### Blending the Images into a Mosaic

Now for the fun part. My procedure was:
1. Pick one image as the reference, and leave it unwarped.
2. Compute a homography from each of the other images into the reference image's plane.
4. Warp every image onto the reference plane's canvas.
5. Blend the images, using a mask computed by comparing each pixel's distance from an edge in either one.

The simplest way to do step 4 is to paste the images down one at a time. This looks bad. The seams are obvious, because the pictures never *quite* match in brightness, and because any small misalignment is obvious. Instead, I used a multi-level laplacian blend, like that I explored in the second project for this class. See the difference:

<div class="image-row cols-2">
  <figure>
    <img src="images/pantry_overwrite.jpg" alt="pantry mosaic composited by overwriting, with visible seams">
    <figcaption>simple overwrite</figcaption>
  </figure>
  <figure>
    <img src="images/pantry_mosaic.jpg" alt="pantry mosaic with blending">
    <figcaption>blended</figcaption>
  </figure>
</div>

Here are the results:

##### Playground and Courts
<figure>
  <img src="images/playground_mosaic.jpg" alt="final mosaic of the playground by the tennis courts">
</figure>


##### Playground and a Sandbox
<figure>
  <img src="images/groundplay_mosaic.jpg" alt="final mosaic of the sandbox playground">
</figure>


##### Pantry
<figure>
  <img src="images/pantry_mosaic.jpg" alt="final mosaic of my pantry">
</figure>


##### Closet
<figure>
  <img src="images/closet_mosaic.jpg" alt="final mosaic of my closet">
</figure>


##### Deer
<figure>
  <img src="images/deer_mosaic.jpg" alt="final mosaic of the deer resting in the woods">
</figure>


### Feature Matching for Autostitching

Clicking pairs of points by hand is tedious and subject to human error. Hence we aim to automate the process by which corresponding points in the images are found, following roughly the methods of  ["Multi-Image Matching using Multi-Scale Oriented Patches"](https://www.microsoft.com/en-us/research/publication/multi-image-matching-using-multi-scale-oriented-patches/). This is the pipeline:
1. detect corners in each image (feature detection),
2. describe the little patch of image around each corner (feature extraction),
3. match descriptors between the two images (feature matching),
4. throw out bad matches with an algorithm called RANSAC, and
5. use the resulting correspondences to compute a homography.

#### (1) Detecting Corners

Most of the correspondences I clicked were corners because they're easy to locate. This intuition guided the creation of something called a Harris Corner Detector, which analyzes the rate of change in pixel intensity to locate pixels which are rapidly changing in all directions (convince yourself that a corner is rapidly changing in all directions). Running a raw harris edge detctor yields a 'corner response' at every pixel which says roughly how 'corner-ey' that pixel is; I considered only the top $10{,}000$ pixels (to keep the computation time reasonable) which are local maxima (i.e. the pixels next door aren't better).

The naive way to pick a top-$500$ set of pixels is to keep those with the strongest response. The problem is that strong corners like to clump together, which leaves the rest of the image empty. That's bad for matching, since we want points spread all over the overlap between two images. Consider a degenerate case where *all* of the strongest corners in image A are in a region that does *not* overlap with image B - there will clearly be no way to line these up!

*Adaptive Non-Maximal Suppression* (ANMS) fixes this. For each candidate corner $i$, we compute a *suppression radius* (distance to the nearest *stronger* corner $j$),

$$
r_i = \min_j \lVert \mathbf{x}_i - \mathbf{x}_j \rVert \quad \text{such that} \quad f(\mathbf{x}_i) < c_{\text{robust}} \, f(\mathbf{x}_j).
$$

We choose $c_{\text{robust}} = 0.9$ so that the suppressing pixel must be significantly stronger than the supressed pixel. Then we keep $500$ corners with the largest $r_i$. This is equivalent to enforcing that every kept pixel is a maximum within a circle of radius $\geq r^\*$ centered at that pixel. We pick $r^\*$ so that precisely $500$ pixels are kept; smaller $r^\*$ will yield more than $500$ pixels but larger $r^\*$ will yield less; and this strategy ensures that every pixel is a *local maximum*.

Here are some examples. The ANMS corners are clearly more evenly spread across space. This characteristic means that ANMS yields a better set of possible corresponding points for autostitching.

##### Wallet
<div class="image-row cols-2">
  <figure>
    <img src="images/wallet_harris_naive.png" alt="the wallet with the 500 strongest Harris corners overlaid in red">
    <figcaption>strongest 500</figcaption>
  </figure>
  <figure>
    <img src="images/wallet_harris_anms.png" alt="the wallet with 500 Harris corners chosen by ANMS overlaid in red">
    <figcaption>ANMS</figcaption>
  </figure>
</div>

##### Closet
<div class="image-row cols-2">
  <figure>
    <img src="images/closet_harris_naive.png" alt="the closet with the 500 strongest Harris corners overlaid in red">
    <figcaption>strongest 500</figcaption>
  </figure>
  <figure>
    <img src="images/closet_harris_anms.png" alt="the closet with 500 Harris corners chosen by ANMS overlaid in red">
    <figcaption>ANMS</figcaption>
  </figure>
</div>

#### (2) Extracting Features

In order to match the possible correspondences between images, we need more than just a pixel; we should also describe the image's local features around each pixel. To do so I took the $40 \times 40$ window centered on each pixel and downsampled it to an $8 \times 8$ patch to be used for feature matching. Each patch is *bias/ gain normalized* to account for shifts in brightness or contrast due to the camera's automatic exposure adjustment. Here are the $40 \times 40$ windows for a few features, and their $8 \times 8$ features descriptors:

##### Wallet
<figure>
  <img src="images/wallet_patches.png" style="width: 100%;" alt="the wallet with four feature windows boxed and numbered">
  <figcaption>40 x 40 windows</figcaption>
</figure>

<figure>
  <img src="images/wallet_patches_zoom.png" alt="the four 8 by 8 descriptors extracted from the numbered wallet windows">
  <figcaption>8 x 8 descriptors</figcaption>
</figure>

##### Closet
<figure>
  <img src="images/closet_patches.png" alt="the closet with eight feature windows boxed and numbered">
  <figcaption>40 x 40 windows</figcaption>
</figure>

<figure>
  <img src="images/closet_patches_zoom.png" alt="the eight 8 by 8 descriptors extracted from the numbered closet windows">
  <figcaption>8 x 8 descriptors</figcaption>
</figure>

Notice that each extracted patch is a corner, edge, circle, or otherwise distinctive feature of the image. After doing this on two images, we in theory have the information necessary to match up the correspondences.

#### (3) Matching Features

After finding a set of distinct features in each of image A and B, we can stack each patch into a vector and run nearest-neighbors on these vectors to find close matches. That is, for each of the patch-vectors from image B, we will find the most similar patch out of all the patch-vectors from image A. We will determine the first *and second* nearest neighbors, and compare the ratio of their distances to determine if they are a "good" match. This works because if they are a true match (i.e. not just two patches that happen to be black-to-white edges in separate regions of the image), the second-best neighbor is generally be much worse than the first-best. This is pretty effective at getting good matches! However, notice patch 8, which does *not* represent a true correspondence even though their patches look very similar.

##### Closet
<div class="image-row cols-2">
  <figure>
    <img src="images/closet_matches_A.png" alt="the bottom closet image with eight matched features boxed and numbered">
    <figcaption>image A</figcaption>
  </figure>
  <figure>
    <img src="images/closet_matches_B.png" alt="the top closet image with the same eight matched features boxed and numbered">
    <figcaption>image B</figcaption>
  </figure>
</div>

<figure>
  <img src="images/closet_matches_zoom.png" alt="the eight matched pairs of 8 by 8 descriptors, image A on top and image B below">
  <figcaption>matched descriptors (A on top, B below)</figcaption>
</figure>

### (4) RANSAC for Robust Homographies

Since we use least squares to compute a homography, and this algorithm is very sensitive to outliers, we want to be very careful *not* to include any bad matches in the set of correspondences. RANdom SAmple Consensus is an algorithm used to throw out the bad apples.

We'll do this by accepting as truth that there is *exactly one* true homography relating the two images. This is true assuming the camera was *rotated only*. Recall we only need four points to determine this. In RANSAC we pick at random four points, compute the corresponding homography $H$, and determine how well $H$ works for *all* of the points. We will call the homography that works for the most points $H^\*$. The points that are predicted well by $H^\*$ are called 'inliers' and those which are not are 'outliers.' Intuitively, we want $H^\*$ that yields the most inliers.

Here are some examples of outliers. Notice that most are not true correspondences or live near the edges of the image (which are perhaps more susceptible to human error in keeping the camera's center of projection fixed as I rotated it, and to lens distortion, which is strongest away from the center of the frame). Yet, if you observe their local patches, they look quite similar. The RANSAC algorithm notices that these points, although they match, do not 'fit' the statistically-best true homography. 

##### Closet
<div class="image-row cols-2">
  <figure>
    <img src="images/closet_outliers_A.png" alt="the bottom closet image with ten outlier features boxed and numbered">
    <figcaption>image A</figcaption>
  </figure>
  <figure>
    <img src="images/closet_outliers_B.png" alt="the top closet image with the same ten outlier features boxed and numbered">
    <figcaption>image B</figcaption>
  </figure>
</div>

<figure>
  <img src="images/closet_outliers_zoom.png" alt="the ten outlier pairs of 8 by 8 descriptors, image 1 above image 2">
  <figcaption>outlier image patches (each pair shows image A's patch above image B's)</figcaption>
</figure>


#### (5) Automatic Mosaics

Here are some mosaics stitched from automatically computed points. These are generally *better* than those computed with manually clicked points; I think some of the seams are much less noticeable.

##### Pantry
<figure>
  <img src="images/pantry_mosaic.jpg" alt="pantry mosaic from hand-clicked correspondences">
  <figcaption>manual</figcaption>
</figure>

<figure>
  <img src="images/pantry_auto_mosaic.jpg" alt="pantry mosaic from automatic correspondences">
  <figcaption>automatic</figcaption>
</figure>

##### Closet
<figure>
  <img src="images/closet_mosaic.jpg" alt="closet mosaic from hand-clicked correspondences">
  <figcaption>manual</figcaption>
</figure>

<figure>
  <img src="images/closet_auto_mosaic.jpg" alt="closet mosaic from automatic correspondences">
  <figcaption>automatic</figcaption>
</figure>

##### Deer
<figure>
  <img src="images/deer_mosaic.jpg" alt="deer mosaic from hand-clicked correspondences">
  <figcaption>manual</figcaption>
</figure>

<figure>
  <img src="images/deer_auto_mosaic.jpg" alt="deer mosaic from automatic correspondences">
  <figcaption>automatic</figcaption>
</figure>

##### Playground and Courts
<figure>
  <img src="images/playground_mosaic.jpg" alt="playground and courts mosaic from hand-clicked correspondences">
  <figcaption>manual</figcaption>
</figure>

<figure>
  <img src="images/playground_auto_mosaic.jpg" alt="playground and courts mosaic from automatic correspondences">
  <figcaption>automatic</figcaption>
</figure>

##### Playground and a Sandbox
<figure>
  <img src="images/groundplay_mosaic.jpg" alt="sandbox playground mosaic from hand-clicked correspondences">
  <figcaption>manual</figcaption>
</figure>

<figure>
  <img src="images/groundplay_auto_mosaic.jpg" alt="sandbox playground mosaic from automatic correspondences">
  <figcaption>automatic</figcaption>
</figure>

##### Tree
With this newly automated algorithm, I figured it would be worth trying a 5-image mosaic. That this was formed by many images is obvious from the difference in brightness, thanks to my phone's automatic exposure adjustment. Recall, this is why we compared correspondences by de-meaned feature patches, so the stitching still lines them up!
<figure>
  <img src="images/tree_auto_mosaic.jpg" alt="tall vertical mosaic of a tree between two buildings, stitched automatically from five photos">
  <figcaption>automatic (five images)</figcaption>
</figure>