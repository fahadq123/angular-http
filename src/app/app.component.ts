import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from "rxjs/operators";
import {PostModel} from "./post.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts = [];
  isFetching = false;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getData();

  }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    this.http.post<{ name: string }>
    ('https://ng-complete-guide-f52d5.firebaseio.com/posts.json',
      postData)
      .subscribe(responseData => {
        console.log(responseData);
      });
  }

  onFetchPosts() {
    // Send Http request
    this.getData();
  }

  onClearPosts() {
    // Send Http request
  }

  getData() {
    this.isFetching = true;
    this.http.get<{ [key: string]: PostModel }>
    ('https://ng-complete-guide-f52d5.firebaseio.com/posts.json')
      .pipe(map((responseData) => {
        const postsArray: PostModel[] = [];
        for (const key in responseData) {
          console.log('key is ' + key);
          if (responseData.hasOwnProperty(key)) {
            // the ... pulls out all the nested key value pairs of responseData
            console.log(responseData[key]);
            postsArray.push({id: key, ...responseData[key]});
          }
        }
        return postsArray;
      })).subscribe(
      (response) => {
        this.loadedPosts = response;
        this.isFetching = false;
      }
    )
  }
}
