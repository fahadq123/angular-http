import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PostService} from "./post.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts = [];
  isFetching = false;
  error = null;
  requestSent = false;
  responseReceived = false;
  private errorSub: Subscription;

  constructor(private http: HttpClient, private postService: PostService) {
  }

  ngOnInit() {
    this.postService.requestSent.subscribe(requestSent => {
      this.requestSent = requestSent;
    })
    this.postService.responseReceived.subscribe(responseReceived => {
      this.responseReceived = responseReceived;
    })

    this.errorSub = this.postService.error.subscribe((error) => {
      this.error = error;
    })
    this.isFetching = true;
    this.postService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.error = error.message;
    })

  }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    this.postService.createAndStorePost(postData);
  }

  onFetchPosts() {
    // Send Http request
    this.isFetching = true;
    this.postService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.isFetching = false;
      this.error = error.message;
    })
  }

  onClearPosts() {
    // Send Http request
    this.postService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    })
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }

  getData() {

  }

  onHandleError() {
    this.error = null;
  }

}
